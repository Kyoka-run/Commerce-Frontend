import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Navbar from './Navbar';

const mockUseSelector = vi.fn();

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: (selector) => mockUseSelector(selector)
  };
});

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/' })
  };
});

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock state - no user, empty cart
    mockUseSelector.mockImplementation((selector) => {
      const state = {
        carts: { cart: [] },
        auth: { user: null }
      };
      return selector(state);
    });
  });

  it('renders the navbar correctly with all navigation links', () => {
    renderWithProviders(<Navbar />);
    
    // Check if the main elements are rendered
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('brand-logo')).toBeInTheDocument();
    expect(screen.getByTestId('nav-links')).toBeInTheDocument();
    
    // Check navigation links
    expect(screen.getByTestId('home-link')).toBeInTheDocument();
    expect(screen.getByTestId('products-link')).toBeInTheDocument();
    expect(screen.getByTestId('about-link')).toBeInTheDocument();
    expect(screen.getByTestId('contact-link')).toBeInTheDocument();
    expect(screen.getByTestId('cart-link')).toBeInTheDocument();
    
    // Check login button (should be present when user is not logged in)
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('toggles the mobile menu when the menu button is clicked', () => {
    renderWithProviders(<Navbar />);
    
    const menuButton = screen.getByTestId('mobile-menu-button');
    const navLinks = screen.getByTestId('nav-links');
    
    // Initially, the menu should be closed on mobile
    expect(navLinks).toHaveClass('h-0');
    
    // Click to open the menu
    fireEvent.click(menuButton);
    expect(navLinks).toHaveClass('h-fit');
    
    // Click again to close the menu
    fireEvent.click(menuButton);
    expect(navLinks).toHaveClass('h-0');
  });

  it('shows UserMenu when user is logged in', () => {
    // Configure mock for logged-in user state
    mockUseSelector.mockImplementation((selector) => {
      const state = {
        carts: { cart: [] },
        auth: { user: { id: 1, username: 'testuser' } }
      };
      return selector(state);
    });
    
    renderWithProviders(<Navbar />);
    
    // Check that the user menu is shown instead of the login button
    expect(screen.getByTestId('navbar-user-menu-container')).toBeInTheDocument();
    expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
  });

  it('displays the correct number of items in the cart badge', () => {
    // Configure mock for cart with items
    mockUseSelector.mockImplementation((selector) => {
      const state = {
        carts: { cart: [{ id: 1 }, { id: 2 }] },
        auth: { user: null }
      };
      return selector(state);
    });
    
    renderWithProviders(<Navbar />);
    
    // Check that the cart badge displays the correct number
    const cartLink = screen.getByTestId('cart-link');
    expect(cartLink).toBeInTheDocument();
    
    // Check if the Badge component is rendered properly
    expect(cartLink).toContainHTML('2');
  });

  it('contains correct navigation hrefs', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByTestId('home-link')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('products-link')).toHaveAttribute('href', '/products');
    expect(screen.getByTestId('about-link')).toHaveAttribute('href', '/about');
    expect(screen.getByTestId('contact-link')).toHaveAttribute('href', '/contact');
    expect(screen.getByTestId('cart-link')).toHaveAttribute('href', '/cart');
    expect(screen.getByTestId('login-button')).toHaveAttribute('href', '/login');
  });
});