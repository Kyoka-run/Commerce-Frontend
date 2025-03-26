import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import PaymentMethod from './PaymentMethod';

// Mock Material UI components
vi.mock('@mui/material', () => ({
  FormControl: vi.fn(({ children, 'data-testid': testId }) => (
    <div data-testid={testId}>{children}</div>
  )),
  FormControlLabel: vi.fn(({ value, control, label, 'data-testid': testId }) => (
    <label data-testid={testId}>
      {control}
      <span>{label}</span>
      <input type="radio" value={value} style={{ display: 'none' }} />
    </label>
  )),
  Radio: vi.fn(({ color }) => <span data-color={color}>○</span>),
  RadioGroup: vi.fn(({ children, value, onChange, 'data-testid': testId }) => (
    <div data-testid={testId} data-value={value} onChange={onChange}>
      {children}
    </div>
  )),
}));

// Mock Redux dispatch
const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch
  };
});

// Mock actions
vi.mock('../../store/actions', () => ({
  addPaymentMethod: vi.fn((method) => ({ type: 'ADD_PAYMENT_METHOD', payload: method })),
  createUserCart: vi.fn((cartItems) => ({ type: 'CREATE_USER_CART', payload: cartItems }))
}));

describe('PaymentMethod Component', () => {
  // Test states
  const initialState = {
    payment: { paymentMethod: null },
    carts: { cart: [], cartId: null },
    errors: { isLoading: false, errorMessage: null }
  };
  
  const stateWithCart = {
    payment: { paymentMethod: null },
    carts: { 
      cart: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 }
      ], 
      cartId: null 
    },
    errors: { isLoading: false, errorMessage: null }
  };
  
  const stateWithCartAndID = {
    payment: { paymentMethod: null },
    carts: { 
      cart: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 }
      ], 
      cartId: 'cart123' 
    },
    errors: { isLoading: false, errorMessage: null }
  };
  
  const stateWithPaymentMethod = {
    payment: { paymentMethod: 'Stripe' },
    carts: { cart: [], cartId: null },
    errors: { isLoading: false, errorMessage: null }
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the payment method container with form elements', () => {
    renderWithProviders(<PaymentMethod />, {
      preloadedState: initialState
    });
    
    expect(screen.getByTestId('payment-method-container')).toBeInTheDocument();
    expect(screen.getByTestId('payment-method-heading')).toBeInTheDocument();
    expect(screen.getByTestId('payment-method-form')).toBeInTheDocument();
    expect(screen.getByTestId('payment-method-radio-group')).toBeInTheDocument();
    expect(screen.getByTestId('payment-method-stripe')).toBeInTheDocument();
    expect(screen.getByTestId('payment-method-paypal')).toBeInTheDocument();
  });
  
  it('displays the correct heading', () => {
    renderWithProviders(<PaymentMethod />, {
      preloadedState: initialState
    });
    
    expect(screen.getByTestId('payment-method-heading')).toHaveTextContent('Select Payment Method');
  });
  
  it('displays both payment options', () => {
    renderWithProviders(<PaymentMethod />, {
      preloadedState: initialState
    });
    
    expect(screen.getByTestId('payment-method-stripe')).toHaveTextContent('Stripe');
    expect(screen.getByTestId('payment-method-paypal')).toHaveTextContent('Paypal');
  });
  
  it('dispatches createUserCart on mount when cart has items but no cartId', () => {
    renderWithProviders(<PaymentMethod />, {
      preloadedState: stateWithCart
    });
    
    // Should dispatch createUserCart with the cart items
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  
  it('does not dispatch createUserCart when cartId already exists', () => {
    renderWithProviders(<PaymentMethod />, {
      preloadedState: stateWithCartAndID
    });
    
    // Should not dispatch because cartId already exists
    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });
  
  it('does not dispatch createUserCart when cart is empty', () => {
    renderWithProviders(<PaymentMethod />, {
      preloadedState: initialState
    });
    
    // Should not dispatch because cart is empty
    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });
  
  it('shows the selected payment method', () => {
    renderWithProviders(<PaymentMethod />, {
      preloadedState: stateWithPaymentMethod
    });
    
    // Radio group should have the selected value
    expect(screen.getByTestId('payment-method-radio-group')).toHaveAttribute('data-value', 'Stripe');
  });
});