import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import UserMenu from './UserMenu';

// Mock Material UI components
vi.mock('@mui/material', () => ({
  Avatar: vi.fn(() => <div data-testid="avatar-mock"></div>),
  Button: vi.fn(({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  )),
  Menu: vi.fn(({ open, children, onClose }) => (
    open ? <div data-testid="menu-mock">{children}</div> : null
  )),
  MenuItem: vi.fn(({ children, onClick, className }) => (
    <div onClick={onClick} className={className} data-testid="menu-item-mock">
      {children}
    </div>
  )),
}));

// Mock BackDrop component
vi.mock('./BackDrop', () => ({
  default: vi.fn(() => <div data-testid="backdrop-mock"></div>)
}));

// Mock icons
vi.mock('react-icons/bi', () => ({
  BiUser: vi.fn(() => <span>UserIcon</span>)
}));

vi.mock('react-icons/fa', () => ({
  FaShoppingCart: vi.fn(() => <span>CartIcon</span>)
}));

vi.mock('react-icons/io5', () => ({
  IoExitOutline: vi.fn(() => <span>LogoutIcon</span>)
}));

// Mock router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Redux actions
vi.mock('../store/actions', () => ({
  logOutUser: vi.fn(() => ({ type: 'LOG_OUT' }))
}));

// Mock useDispatch
const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

describe('UserMenu Component', () => {
  // State with a logged-in user
  const loggedInState = {
    auth: {
      user: {
        id: 1,
        username: 'testuser',
      }
    }
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the user menu container and avatar', () => {
    renderWithProviders(<UserMenu />, {
      preloadedState: loggedInState
    });
    
    expect(screen.getByTestId('user-menu-container')).toBeInTheDocument();
    expect(screen.getByTestId('user-avatar-button')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-mock')).toBeInTheDocument();
  });
  
  it('opens the dropdown menu when avatar is clicked', () => {
    renderWithProviders(<UserMenu />, {
      preloadedState: loggedInState
    });
    
    // Menu should initially be closed
    expect(screen.queryByTestId('menu-mock')).not.toBeInTheDocument();
    
    // Click avatar to open menu
    const avatarButton = screen.getByTestId('user-avatar-button');
    fireEvent.click(avatarButton);
    
    // Menu should now be open
    expect(screen.getByTestId('menu-mock')).toBeInTheDocument();
    expect(screen.getAllByTestId('menu-item-mock').length).toBe(3);
  });
  
  it('displays the user\'s username', () => {
    renderWithProviders(<UserMenu />, {
      preloadedState: loggedInState
    });
    
    // Open menu
    const avatarButton = screen.getByTestId('user-avatar-button');
    fireEvent.click(avatarButton);
    
    // Check username display
    expect(screen.getByTestId('profile-link')).toBeInTheDocument();
    expect(screen.getByTestId('username-display')).toHaveTextContent('testuser');
  });
  
  it('has links to profile and orders', () => {
    renderWithProviders(<UserMenu />, {
      preloadedState: loggedInState
    });
    
    // Open menu
    const avatarButton = screen.getByTestId('user-avatar-button');
    fireEvent.click(avatarButton);
    
    // Check links
    expect(screen.getByTestId('profile-link')).toHaveAttribute('href', '/profile');
    expect(screen.getByTestId('orders-link')).toHaveAttribute('href', '/profile/orders');
  });
  
  it('calls logOutUser action when logout button is clicked', () => {
    renderWithProviders(<UserMenu />, {
      preloadedState: loggedInState
    });
    
    // Open menu
    const avatarButton = screen.getByTestId('user-avatar-button');
    fireEvent.click(avatarButton);
    
    // Click logout button
    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);
    
    // Should dispatch logout action
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledTimes(0); // Navigate is called in the action, not directly
  });
  
  it('shows backdrop when menu is open', () => {
    renderWithProviders(<UserMenu />, {
      preloadedState: loggedInState
    });
    
    // Backdrop should not be present initially
    expect(screen.queryByTestId('backdrop-mock')).not.toBeInTheDocument();
    
    // Open menu
    const avatarButton = screen.getByTestId('user-avatar-button');
    fireEvent.click(avatarButton);
    
    // Backdrop should appear
    expect(screen.getByTestId('backdrop-mock')).toBeInTheDocument();
  });
});