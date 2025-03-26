import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Login from './Login';

// Mock the dispatch function and navigate
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => vi.fn()
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

// Mock the toast notifications
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    renderWithProviders(<Login />);
    
    // Check if the main elements are rendered
    expect(screen.getByTestId('login-container')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('login-heading')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByTestId('signup-link')).toBeInTheDocument();
  });

  it('displays validation errors when form is submitted without values', async () => {
    renderWithProviders(<Login />);
    
    // Submit the form without entering any values
    fireEvent.click(screen.getByTestId('login-button'));
    
    // Check if validation errors are displayed
    expect(await screen.findByTestId('username-error')).toBeInTheDocument();
    expect(await screen.findByTestId('password-error')).toBeInTheDocument();
  });

  it('allows entering username and password', () => {
    renderWithProviders(<Login />);
    
    // Enter values in the form fields
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' }
    });
    
    // Check if values are set correctly
    expect(screen.getByTestId('username-input')).toHaveValue('testuser');
    expect(screen.getByTestId('password-input')).toHaveValue('password123');
  });

  it('navigates to register page when signup link is clicked', () => {
    renderWithProviders(<Login />);
    
    const signupLink = screen.getByTestId('signup-link');
    expect(signupLink).toHaveAttribute('href', '/register');
  });
});