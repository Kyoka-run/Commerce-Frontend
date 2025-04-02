import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import UserOrders from './UserOrders';

// Mock the components
vi.mock('../shared/Loader', () => ({
  default: vi.fn(({ text }) => <div data-testid="loader-mock">{text}</div>)
}));

vi.mock('../shared/ErrorPage', () => ({
  default: vi.fn(({ message }) => <div data-testid="error-page-mock">{message}</div>)
}));

// Mock the format price function
vi.mock('../../utils/formatPrice', () => ({
  formatPrice: vi.fn((price) => `$${price.toFixed(2)}`)
}));

// Mock redux dispatch
const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch
  };
});

// Mock the actions
vi.mock('../../store/actions', () => ({
  getUserOrders: vi.fn(() => ({ type: 'GET_USER_ORDERS' }))
}));

describe('UserOrders Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state while fetching orders', () => {
    renderWithProviders(<UserOrders />, {
      preloadedState: {
        auth: { user: { id: 1, username: 'testuser' }, orders: [] },
        errors: { isLoading: true, errorMessage: null }
      }
    });
    
    expect(screen.getByTestId('loader-mock')).toBeInTheDocument();
    expect(screen.getByTestId('loader-mock')).toHaveTextContent('Loading your orders...');
  });

  it('shows error message when order fetching fails', () => {
    renderWithProviders(<UserOrders />, {
      preloadedState: {
        auth: { user: { id: 1, username: 'testuser' }, orders: [] },
        errors: { isLoading: false, errorMessage: 'Failed to fetch orders' }
      }
    });
    
    expect(screen.getByTestId('error-page-mock')).toBeInTheDocument();
    expect(screen.getByTestId('error-page-mock')).toHaveTextContent('Failed to fetch orders');
  });

  it('shows empty orders message when no orders exist', () => {
    renderWithProviders(<UserOrders />, {
      preloadedState: {
        auth: { user: { id: 1, username: 'testuser' }, orders: [] },
        errors: { isLoading: false, errorMessage: null }
      }
    });
    
    expect(screen.getByTestId('no-orders-message')).toBeInTheDocument();
    expect(screen.getByText("You don't have any orders yet")).toBeInTheDocument();
    expect(screen.getByText('Browse Products')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products');
  });

  it('displays order list when orders exist', () => {
    const mockOrders = [
      {
        orderId: 1,
        orderDate: '2023-04-01',
        orderStatus: 'Delivered',
        totalAmount: 120,
        payment: {
          paymentMethod: 'Credit Card',
          pgPaymentId: 'pay_123456'
        },
        orderItems: [
          {
            orderItemId: 101,
            quantity: 2,
            orderedProductPrice: 40,
            product: {
              productId: 201,
              productName: 'Test Product 1'
            }
          },
          {
            orderItemId: 102,
            quantity: 1,
            orderedProductPrice: 40,
            product: {
              productId: 202,
              productName: 'Test Product 2'
            }
          }
        ]
      }
    ];

    renderWithProviders(<UserOrders />, {
      preloadedState: {
        auth: { user: { id: 1, username: 'testuser' }, orders: mockOrders },
        errors: { isLoading: false, errorMessage: null }
      }
    });
    
    expect(screen.getByTestId('orders-list')).toBeInTheDocument();
    expect(screen.getByTestId('order-item-1')).toBeInTheDocument();
    expect(screen.getByText('Order #1')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
    expect(screen.getByText('Credit Card')).toBeInTheDocument();
    expect(screen.getByTestId('order-product-101')).toBeInTheDocument();
    expect(screen.getByTestId('order-product-102')).toBeInTheDocument();
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('Total: $120.00')).toBeInTheDocument();
  });

  it('displays multiple orders when they exist', () => {
    const mockOrders = [
      {
        orderId: 1,
        orderDate: '2023-04-01',
        orderStatus: 'Delivered',
        totalAmount: 120,
        payment: {
          paymentMethod: 'Credit Card',
          pgPaymentId: 'pay_123456'
        },
        orderItems: [
          {
            orderItemId: 101,
            quantity: 2,
            orderedProductPrice: 40,
            product: {
              productId: 201,
              productName: 'Test Product 1'
            }
          }
        ]
      },
      {
        orderId: 2,
        orderDate: '2023-04-15',
        orderStatus: 'Processing',
        totalAmount: 80,
        payment: {
          paymentMethod: 'PayPal',
          pgPaymentId: 'pay_789012'
        },
        orderItems: [
          {
            orderItemId: 103,
            quantity: 1,
            orderedProductPrice: 80,
            product: {
              productId: 203,
              productName: 'Test Product 3'
            }
          }
        ]
      }
    ];

    renderWithProviders(<UserOrders />, {
      preloadedState: {
        auth: { user: { id: 1, username: 'testuser' }, orders: mockOrders },
        errors: { isLoading: false, errorMessage: null }
      }
    });
    
    expect(screen.getByTestId('orders-list')).toBeInTheDocument();
    expect(screen.getByTestId('order-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('order-item-2')).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText('PayPal')).toBeInTheDocument();
    expect(screen.getByText('Test Product 3')).toBeInTheDocument();
  });

  it('displays page title correctly', () => {
    renderWithProviders(<UserOrders />, {
      preloadedState: {
        auth: { user: { id: 1, username: 'testuser' }, orders: [] },
        errors: { isLoading: false, errorMessage: null }
      }
    });
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('My Orders');
  });

  it('dispatches getUserOrders when component mounts with user logged in', () => {
    renderWithProviders(<UserOrders />, {
      preloadedState: {
        auth: { user: { id: 1, username: 'testuser' }, orders: [] },
        errors: { isLoading: false, errorMessage: null }
      }
    });
    
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('does not dispatch getUserOrders when no user is logged in', () => {
    renderWithProviders(<UserOrders />, {
      preloadedState: {
        auth: { user: null, orders: [] },
        errors: { isLoading: false, errorMessage: null }
      }
    });
    
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});