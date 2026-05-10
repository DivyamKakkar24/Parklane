import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route } from 'react-router-dom';
import AuthForm from '../components/Auth/AuthForm';
import { ContextProvider } from '../AppContext';

// Mock fetch
global.fetch = jest.fn();

const renderAuthForm = (mode = 'login') => {
  return render(
    <ContextProvider>
      <MemoryRouter initialEntries={[`/auth/${mode}`]}>
        <Route path="/auth/:mode">
          <AuthForm />
        </Route>
      </MemoryRouter>
    </ContextProvider>
  );
};

describe('AuthForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  it('renders login form', () => {
    renderAuthForm('login');
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Password')).toBeInTheDocument();
    expect(screen.getByText('Create an account')).toBeInTheDocument();
  });

  it('renders signup form', () => {
    renderAuthForm('signup');
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Login with existing account')).toBeInTheDocument();
  });

  it('shows error for invalid email', async () => {
    renderAuthForm('login');

    fireEvent.change(screen.getByLabelText('Your Email'), {
      target: { value: 'invalidemail' }
    });
    fireEvent.change(screen.getByLabelText('Your Password'), {
      target: { value: 'password' }
    });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Invalid Email')).toBeInTheDocument();
    });
  });

  it('shows error for invalid password on signup', async () => {
    renderAuthForm('signup');

    fireEvent.change(screen.getByLabelText('Your Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Your Password'), {
      target: { value: 'short' }
    });

    fireEvent.click(screen.getByText('Create Account'));

    await waitFor(() => {
      expect(screen.getByText('Password atleast 8 chars long')).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    const mockResponse = {
      idToken: 'test-token',
      email: 'test@example.com',
      expiresIn: '3600'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    renderAuthForm('login');

    fireEvent.change(screen.getByLabelText('Your Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Your Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAtWBTV6j8wvd0Z_A8sBMTi_yyUddvaGU4',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
            returnSecureToken: true
          })
        })
      );
    });

    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });

  it('handles successful signup', async () => {
    const mockResponse = {
      idToken: 'test-token',
      email: 'test@example.com',
      expiresIn: '3600'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    renderAuthForm('signup');

    fireEvent.change(screen.getByLabelText('Your Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Your Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByText('Create Account'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAtWBTV6j8wvd0Z_A8sBMTi_yyUddvaGU4',
        expect.any(Object)
      );
    });

    expect(screen.getByText('Successfully Signed Up')).toBeInTheDocument();
  });

  it('handles API error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: { message: 'INVALID_PASSWORD' } })
    });

    renderAuthForm('login');

    fireEvent.change(screen.getByLabelText('Your Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Your Password'), {
      target: { value: 'wrongpassword' }
    });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('INVALID PASSWORD')).toBeInTheDocument();
    });
  });
});