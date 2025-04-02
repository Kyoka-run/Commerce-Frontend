import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import UserProfile from './UserProfile';

describe('UserProfile Component', () => {
  it('displays login message when user is not logged in', () => {
    renderWithProviders(<UserProfile />, {
      preloadedState: {
        auth: { user: null }
      }
    });
    
    expect(screen.getByText('Please login to view your profile')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/login');
  });

  it('renders profile information when user is logged in', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    };

    renderWithProviders(<UserProfile />, {
      preloadedState: {
        auth: { user: mockUser }
      }
    });
    
    expect(screen.getByTestId('profile-container')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByTestId('profile-username')).toHaveTextContent('testuser');
    expect(screen.getByTestId('profile-email')).toHaveTextContent('test@example.com');
    expect(screen.getByText('Account Information')).toBeInTheDocument();
  });

  it('has a working link to orders page', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    };

    renderWithProviders(<UserProfile />, {
      preloadedState: {
        auth: { user: mockUser }
      }
    });
    
    const ordersLink = screen.getByTestId('view-orders-button');
    expect(ordersLink).toBeInTheDocument();
    expect(ordersLink).toHaveAttribute('href', '/profile/orders');
    expect(ordersLink).toHaveTextContent('View My Orders');
  });
});