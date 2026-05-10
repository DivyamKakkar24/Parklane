import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Presence from '../components/StartingPage/Presence';
import { ContextProvider } from '../AppContext';

// Mock components to avoid complex routing issues
jest.mock('../components/Layout/Navbar2', () => {
  return function Navbar2() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock('../components/Layout/Places/PlacesList', () => {
  return function PlacesList() {
    return <div>Our presence</div>;
  };
});

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

// Mock geolocation
global.navigator.geolocation = {
  getCurrentPosition: jest.fn((success) => {
    success({ coords: { longitude: 77.5946, latitude: 12.9716 } });
  }),
};

describe('Presence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        features: []
      })
    });
  });

  it('renders Navbar2 and PlacesList', () => {
    render(
      <BrowserRouter>
        <ContextProvider>
          <Presence />
        </ContextProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Our presence')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});