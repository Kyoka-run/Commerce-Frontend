import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Register from './Register';

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

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the register form correctly', () => {
    renderWithProviders(<Register />);
    
    // Check if the main elements are rendered
    expect(screen.getByTestId('register-container')).toBeInTheDocument();
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(screen.getByTestId('register-heading')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('register-button')).toBeInTheDocument();
    expect(screen.getByTestId('login-link')).toBeInTheDocument();
  });

  it('displays validation errors when form is submitted without values', async () => {
    renderWithProviders(<Register />);
    
    // Submit the form without entering any values
    fireEvent.click(screen.getByTestId('register-button'));
    
    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByTestId('username-error')).toBeInTheDocument();
      expect(screen.getByTestId('email-error')).toBeInTheDocument();
      expect(screen.getByTestId('password-error')).toBeInTheDocument();
    });
  });

  it('allows entering username, email and password', () => {
    renderWithProviders(<Register />);
    
    // Enter values in the form fields
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' }
    });
    
    // Check if values are set correctly
    expect(screen.getByTestId('username-input')).toHaveValue('testuser');
    expect(screen.getByTestId('email-input')).toHaveValue('test@example.com');
    expect(screen.getByTestId('password-input')).toHaveValue('password123');
  });

  it('shows error for too short password', async () => {
    renderWithProviders(<Register />);
    
    // Enter a short password
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: '12345' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByTestId('register-button'));
    
    // Check for the minimum length error message
    await waitFor(() => {
      const errorMessage = screen.getByTestId('password-error');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.textContent).toContain('Minimum 6 character is required');
    });
  });

  it('navigates to login page when login link is clicked', () => {
    renderWithProviders(<Register />);
    
    const loginLink = screen.getByTestId('login-link');
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});