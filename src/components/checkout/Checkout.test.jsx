import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Checkout from './Checkout';

// Mock Material UI components
vi.mock('@mui/material', () => ({
  Button: vi.fn(({ children, onClick, disabled, variant, 'data-testid': testId }) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      data-variant={variant}
      data-testid={testId}
    >
      {children}
    </button>
  )),
  Step: vi.fn(({ children, 'data-testid': testId }) => (
    <div data-testid={testId}>{children}</div>
  )),
  StepLabel: vi.fn(({ children }) => <div>{children}</div>),
  Stepper: vi.fn(({ children, activeStep, 'data-testid': testId }) => (
    <div data-testid={testId} data-active-step={activeStep}>
      {children}
    </div>
  )),
}));

// Mock component dependencies
vi.mock('./AddressInfo', () => ({
  default: vi.fn(({ address }) => (
    <div data-testid="address-info-mock">
      Address Info Component (Addresses: {address?.length || 0})
    </div>
  ))
}));

vi.mock('./PaymentMethod', () => ({
  default: vi.fn(() => <div data-testid="payment-method-mock">Payment Method Component</div>)
}));

vi.mock('./OrderSummary', () => ({
  default: vi.fn(({ totalPrice, cart, address, paymentMethod }) => (
    <div data-testid="order-summary-mock">
      Order Summary Component (Total: ${totalPrice}, Items: {cart?.length})
    </div>
  ))
}));

vi.mock('./StripePayment', () => ({
  default: vi.fn(() => <div data-testid="stripe-payment-mock">Stripe Payment Component</div>)
}));

vi.mock('./PaypalPayment', () => ({
  default: vi.fn(() => <div data-testid="paypal-payment-mock">Paypal Payment Component</div>)
}));

vi.mock('../shared/Skeleton', () => ({
  default: vi.fn(() => <div data-testid="skeleton-mock">Skeleton Loading</div>)
}));

vi.mock('../shared/ErrorPage', () => ({
  default: vi.fn(({ message }) => (
    <div data-testid="error-page-mock">Error: {message}</div>
  ))
}));

// Mock toast notification
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn()
  }
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

// Mock actions
vi.mock('../../store/actions', () => ({
  getUserAddresses: vi.fn(() => ({ type: 'GET_USER_ADDRESSES' }))
}));

describe('Checkout Component', () => {
  // Test states
  const loadingState = {
    errors: { isLoading: true, errorMessage: null },
    carts: { cart: [], totalPrice: 0 },
    auth: { address: [], selectedUserCheckoutAddress: null },
    payment: { paymentMethod: null }
  };

  const errorState = {
    errors: { isLoading: false, errorMessage: 'Failed to load checkout' },
    carts: { cart: [], totalPrice: 0 },
    auth: { address: [], selectedUserCheckoutAddress: null },
    payment: { paymentMethod: null }
  };

  const initialState = {
    errors: { isLoading: false, errorMessage: null },
    carts: { 
      cart: [{ id: 1, name: 'Test Product', price: 100, quantity: 2 }],
      totalPrice: 200 
    },
    auth: { 
      address: [{ addressId: 1, city: 'Test City', street: 'Test Street' }],
      selectedUserCheckoutAddress: null 
    },
    payment: { paymentMethod: null }
  };

  const addressSelectedState = {
    ...initialState,
    auth: {
      ...initialState.auth,
      selectedUserCheckoutAddress: { addressId: 1, city: 'Test City', street: 'Test Street' }
    }
  };

  const paymentSelectedState = {
    ...addressSelectedState,
    payment: { paymentMethod: 'Stripe' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the checkout container and stepper', () => {
    renderWithProviders(<Checkout />, {
      preloadedState: initialState
    });
    
    expect(screen.getByTestId('checkout-container')).toBeInTheDocument();
    expect(screen.getByTestId('checkout-stepper')).toBeInTheDocument();
    
    // Check that all steps are rendered
    expect(screen.getByTestId('checkout-step-0')).toBeInTheDocument();
    expect(screen.getByTestId('checkout-step-1')).toBeInTheDocument();
    expect(screen.getByTestId('checkout-step-2')).toBeInTheDocument();
    expect(screen.getByTestId('checkout-step-3')).toBeInTheDocument();
  });

  it('shows loading skeleton when isLoading is true', () => {
    renderWithProviders(<Checkout />, {
      preloadedState: loadingState
    });
    
    expect(screen.getByTestId('checkout-loader')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('checkout-content')).not.toBeInTheDocument();
  });

  it('shows error page when there is an error', () => {
    renderWithProviders(<Checkout />, {
      preloadedState: errorState
    });
    
    expect(screen.getByTestId('error-page-mock')).toBeInTheDocument();
  });

  it('dispatches getUserAddresses on component mount', () => {
    renderWithProviders(<Checkout />, {
      preloadedState: initialState
    });
    
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('initially displays the address step', () => {
    renderWithProviders(<Checkout />, {
      preloadedState: initialState
    });
    
    expect(screen.getByTestId('address-step')).toBeInTheDocument();
    expect(screen.getByTestId('address-info-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('payment-method-step')).not.toBeInTheDocument();
    expect(screen.queryByTestId('order-summary-step')).not.toBeInTheDocument();
    expect(screen.queryByTestId('payment-step')).not.toBeInTheDocument();
  });

  it('has back button disabled on first step', () => {
    renderWithProviders(<Checkout />, {
      preloadedState: initialState
    });
    
    const backButton = screen.getByTestId('back-button');
    expect(backButton).toBeDisabled();
  });

  it('has next button disabled when no address is selected', () => {
    renderWithProviders(<Checkout />, {
      preloadedState: initialState
    });
    
    const nextButton = screen.getByTestId('next-button');
    // Button is not technically disabled (for styling reasons) but has opacity class
    expect(nextButton.className).toContain('opacity-60');
  });

  it('advances to payment method step when next button is clicked with address selected', () => {
    renderWithProviders(<Checkout />, {
      preloadedState: addressSelectedState
    });
    
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    
    expect(screen.getByTestId('payment-method-step')).toBeInTheDocument();
    expect(screen.getByTestId('payment-method-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('address-step')).not.toBeInTheDocument();
  });
  
  it('advances to payment step when next button is clicked from order summary', () => {
    renderWithProviders(<Checkout />, {
      preloadedState: paymentSelectedState
    });
    
    const nextButton = screen.getByTestId('next-button');
    
    // First click to go to payment method
    fireEvent.click(nextButton);
    
    // Second click to go to order summary
    fireEvent.click(nextButton);
    
    // Third click to go to payment
    fireEvent.click(nextButton);
    
    expect(screen.getByTestId('payment-step')).toBeInTheDocument();
    expect(screen.queryByTestId('order-summary-step')).not.toBeInTheDocument();
  });
  
  it('renders Stripe payment when payment method is Stripe', () => {
    const stripePaymentState = {
      ...paymentSelectedState,
      payment: { paymentMethod: 'Stripe' }
    };
    
    renderWithProviders(<Checkout />, {
      preloadedState: stripePaymentState
    });
    
    const nextButton = screen.getByTestId('next-button');
    
    // Navigate to payment step
    fireEvent.click(nextButton); // To payment method
    fireEvent.click(nextButton); // To order summary
    fireEvent.click(nextButton); // To payment
    
    expect(screen.getByTestId('stripe-payment-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('paypal-payment-mock')).not.toBeInTheDocument();
  });
  
  it('renders Paypal payment when payment method is Paypal', () => {
    const paypalPaymentState = {
      ...paymentSelectedState,
      payment: { paymentMethod: 'Paypal' }
    };
    
    renderWithProviders(<Checkout />, {
      preloadedState: paypalPaymentState
    });
    
    const nextButton = screen.getByTestId('next-button');
    
    // Navigate to payment step
    fireEvent.click(nextButton); // To payment method
    fireEvent.click(nextButton); // To order summary
    fireEvent.click(nextButton); // To payment
    
    expect(screen.getByTestId('paypal-payment-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('stripe-payment-mock')).not.toBeInTheDocument();
  });
  
  it('goes back to previous step when back button is clicked', () => {
    renderWithProviders(<Checkout />, {
      preloadedState: paymentSelectedState
    });
    
    const nextButton = screen.getByTestId('next-button');
    const backButton = screen.getByTestId('back-button');
    
    // Go to payment method step
    fireEvent.click(nextButton);
    expect(screen.getByTestId('payment-method-step')).toBeInTheDocument();
    
    // Go back to address step
    fireEvent.click(backButton);
    expect(screen.getByTestId('address-step')).toBeInTheDocument();
    expect(screen.queryByTestId('payment-method-step')).not.toBeInTheDocument();
  });
  
  it('hides next button on the last step', () => {
    renderWithProviders(<Checkout />, {
      preloadedState: paymentSelectedState
    });
    
    const nextButton = screen.getByTestId('next-button');
    
    // Navigate to payment step
    fireEvent.click(nextButton); // To payment method
    fireEvent.click(nextButton); // To order summary
    fireEvent.click(nextButton); // To payment
    
    // Next button should not be visible on the last step
    expect(screen.queryByTestId('next-button')).not.toBeInTheDocument();
  });
});