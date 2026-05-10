import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/Auth/PrivateRoute';
import { ContextProvider } from '../AppContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Mock geolocation
global.navigator.geolocation = {
  getCurrentPosition: jest.fn(),
};

const TestComponent = () => <div>Protected Content</div>;

describe('PrivateRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    fetch.mockClear();
  });

  it('renders children when logged in', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'test-token';
      if (key === 'expirationTime') return '2026-05-11T00:00:00.000Z';
      return null;
    });

    render(
      <Router>
        <ContextProvider>
          <Routes>
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <TestComponent />
                </PrivateRoute>
              }
            />
          </Routes>
        </ContextProvider>
      </Router>,
      { initialEntries: ['/protected'] }
    );

    // When logged in, component should render
    expect(screen.queryByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects when not logged in', () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <Router>
        <ContextProvider>
          <Routes>
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <TestComponent />
                </PrivateRoute>
              }
            />
            <Route path="/auth/login" element={<div>Login Page</div>} />
          </Routes>
        </ContextProvider>
      </Router>,
      { initialEntries: ['/protected'] }
    );

    // When not logged in, should redirect
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});