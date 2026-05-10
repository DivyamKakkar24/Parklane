import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import PlaceItem from '../components/Layout/Places/PlaceItem';

const mockPlace = {
  id: '1',
  name: 'Test Place',
  info: 'Test Address',
  image: 'test-image.jpg',
  price: 40,
  lat: 12.9716,
  lon: 77.5946
};

describe('PlaceItem', () => {
  it('renders place item', () => {
    render(
      <MemoryRouter>
        <PlaceItem {...mockPlace} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Place')).toBeInTheDocument();
    expect(screen.getByAltText('Test Place')).toBeInTheDocument();
    expect(screen.getByTitle('View on map')).toBeInTheDocument();
  });

  it('opens map modal on button click', () => {
    render(
      <MemoryRouter>
        <PlaceItem {...mockPlace} />
      </MemoryRouter>
    );

    const mapButton = screen.getByTitle('View on map');
    fireEvent.click(mapButton);

    // Check that modal is rendered by verifying the header contains the address
    expect(screen.getByText('Test Address')).toBeInTheDocument();
  });
});