import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContextProvider, useAppContext } from '../AppContext';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};
global.navigator.geolocation = mockGeolocation;

// Test component to access context
const TestComponent = () => {
  const context = useAppContext();
  return (
    <div>
      <div data-testid="token">{context.token || 'null'}</div>
      <div data-testid="email">{context.email || 'null'}</div>
      <div data-testid="isLoggedIn">{context.isLoggedIn ? 'true' : 'false'}</div>
      <div data-testid="loading">{context.loading ? 'true' : 'false'}</div>
      <div data-testid="places-count">{context.places.length}</div>
      <div data-testid="search-term">{context.searchTerm}</div>
      <button onClick={() => context.setSearchTerm('test')}>Set Search</button>
      <button onClick={() => context.loginHandler('test-token', '2026-05-11T00:00:00.000Z')}>Login</button>
      <button onClick={context.logoutHandler}>Logout</button>
    </div>
  );
};

describe('AppContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
    localStorageMock.removeItem.mockImplementation(() => {});
  });

  it('renders children', () => {
    render(
      <ContextProvider>
        <div>Test Child</div>
      </ContextProvider>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('initializes with no token when none stored', () => {
    render(
      <ContextProvider>
        <TestComponent />
      </ContextProvider>
    );
    expect(screen.getByTestId('token')).toHaveTextContent('null');
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false');
  });

  it('initializes with token when valid token stored', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'stored-token';
      if (key === 'email') return 'test@example.com';
      if (key === 'expirationTime') return '2026-05-11T00:00:00.000Z';
      return null;
    });

    render(
      <ContextProvider>
        <TestComponent />
      </ContextProvider>
    );
    expect(screen.getByTestId('token')).toHaveTextContent('stored-token');
    expect(screen.getByTestId('email')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true');
  });

  it('removes expired token', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'expired-token';
      if (key === 'expirationTime') return '2020-01-01T00:00:00.000Z'; // past
      return null;
    });

    render(
      <ContextProvider>
        <TestComponent />
      </ContextProvider>
    );
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('email');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('expirationTime');
  });

  it('handles login', () => {
    render(
      <ContextProvider>
        <TestComponent />
      </ContextProvider>
    );

    act(() => {
      screen.getByText('Login').click();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'test-token');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('expirationTime', '2026-05-11T00:00:00.000Z');
    expect(screen.getByTestId('token')).toHaveTextContent('test-token');
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true');
  });

  it('handles logout', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'test-token';
      if (key === 'email') return 'test@example.com';
      if (key === 'expirationTime') return '2026-05-11T00:00:00.000Z';
      return null;
    });

    render(
      <ContextProvider>
        <TestComponent />
      </ContextProvider>
    );

    act(() => {
      screen.getByText('Logout').click();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('email');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('expirationTime');
    expect(screen.getByTestId('token')).toHaveTextContent('null');
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false');
  });

  it('fetches places on mount', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({ coords: { longitude: 77.5946, latitude: 12.9716 } });
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        features: [
          {
            properties: {
              place_id: '1',
              name: 'Test Place',
              formatted: 'Test Address',
              lat: 12.9716,
              lon: 77.5946,
              categories: ['parking.cars']
            }
          }
        ]
      })
    });

    render(
      <ContextProvider>
        <TestComponent />
      </ContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(fetch).toHaveBeenCalled();
    expect(screen.getByTestId('places-count')).toHaveTextContent('1');
  });

  it('updates search term and refetches places', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({ coords: { longitude: 77.5946, latitude: 12.9716 } });
    });

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ features: [] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          features: [
            {
              properties: {
                place_id: '2',
                name: 'Searched Place',
                formatted: 'Searched Address',
                lat: 13.0827,
                lon: 80.2707,
                categories: ['tourism.attraction']
              }
            }
          ]
        })
      });

    render(
      <ContextProvider>
        <TestComponent />
      </ContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    act(() => {
      screen.getByText('Set Search').click();
    });

    expect(screen.getByTestId('search-term')).toHaveTextContent('test');

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    expect(screen.getByTestId('places-count')).toHaveTextContent('1');
  });
});