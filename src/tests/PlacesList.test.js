import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlacesList from '../components/Layout/Places/PlacesList';
import { ContextProvider } from '../AppContext';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

// Mock geolocation
global.navigator.geolocation = {
  getCurrentPosition: jest.fn(),
};

describe('PlacesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    global.navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
      success({ coords: { longitude: 77.5946, latitude: 12.9716 } });
    });
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        features: [
          {
            properties: {
              place_id: '1',
              name: 'Test Parking',
              formatted: 'Test Address',
              lat: 12.9716,
              lon: 77.5946,
              categories: ['parking.cars']
            }
          }
        ]
      })
    });
  });

  it('renders loading initially', () => {
    render(
      <ContextProvider>
        <PlacesList />
      </ContextProvider>
    );

    expect(screen.getByText('Our presence')).toBeInTheDocument();
  });

  it('renders places after loading', async () => {
    render(
      <ContextProvider>
        <PlacesList />
      </ContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Parking')).toBeInTheDocument();
    });
  });

  it('shows no parking message when no places', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ features: [] })
    });

    render(
      <ContextProvider>
        <PlacesList />
      </ContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No parking found near that location')).toBeInTheDocument();
    });
  });
});