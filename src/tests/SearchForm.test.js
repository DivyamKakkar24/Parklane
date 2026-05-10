import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchForm from '../components/Layout/SearchForm';
import { ContextProvider } from '../AppContext';

describe('SearchForm', () => {
  it('renders search form', () => {
    render(
      <ContextProvider>
        <SearchForm />
      </ContextProvider>
    );

    expect(screen.getByPlaceholderText('Search a city or address...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls setSearchTerm on form submit', () => {
    const mockSetSearchTerm = jest.fn();
    jest.spyOn(require('../AppContext'), 'useAppContext').mockReturnValue({
      setSearchTerm: mockSetSearchTerm
    });

    render(
      <ContextProvider>
        <SearchForm />
      </ContextProvider>
    );

    const input = screen.getByPlaceholderText('Search a city or address...');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Bangalore' } });
    fireEvent.click(button);

    expect(mockSetSearchTerm).toHaveBeenCalledWith('Bangalore');
  });
});