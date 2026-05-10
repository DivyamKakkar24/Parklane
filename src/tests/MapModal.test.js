import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapModal from '../components/Layout/Map/MapModal';

// Mock react-leaflet
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => null,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  useMap: () => ({
    invalidateSize: jest.fn()
  })
}));

const mockProps = {
  lat: 12.9716,
  lon: 77.5946,
  name: 'Test Place',
  address: 'Test Address',
  onClose: jest.fn()
};

describe('MapModal', () => {
  it('renders modal with place details', () => {
    render(<MapModal {...mockProps} />);

    // Use getByRole to get the specific h3 in header
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Test Place');
    expect(screen.getByText('Test Address')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument(); // Close button
  });

  it('calls onClose when close button clicked', () => {
    render(<MapModal {...mockProps} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose on backdrop click', () => {
    render(<MapModal {...mockProps} />);

    // Click the backdrop (aside element)
    const backdrop = document.querySelector('.backdrop');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockProps.onClose).toHaveBeenCalled();
    }
  });
});