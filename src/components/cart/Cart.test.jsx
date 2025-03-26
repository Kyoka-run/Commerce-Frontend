import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Cart from './Cart';
import CartEmpty from './CartEmpty';

// Mock components
vi.mock('./CartEmpty', () => ({
  default: vi.fn(() => <div data-testid="cart-empty">Cart is empty</div>)
}));

vi.mock('./ItemContent', () => ({
  default: vi.fn(({ productId, productName, price, specialPrice, quantity }) => (
    <div data-testid={`cart-item-${productId}`}>
      <span>{productName}</span>
      <span>Price: ${specialPrice}</span>
      <span>Qty: {quantity}</span>
    </div>
  ))
}));

// Mock formatPrice
vi.mock('../../utils/formatPrice', () => ({
  formatPrice: vi.fn((amount) => `$${amount.toFixed(2)}`)
}));

// Initial state with cart items
const preloadedState = {
  carts: {
    cart: [
      {
        productId: 1,
        productName: 'Test Product 1',
        image: 'test-image-1.jpg',
        description: 'Test description 1',
        quantity: 2,
        price: 100,
        specialPrice: 80,
      },
      {
        productId: 2,
        productName: 'Test Product 2',
        image: 'test-image-2.jpg',
        description: 'Test description 2',
        quantity: 1,
        price: 50,
        specialPrice: 40,
      }
    ]
  }
};

// Empty cart state
const emptyCartState = {
  carts: { cart: [] }
};

describe('Cart Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders CartEmpty when cart is empty', () => {
    renderWithProviders(<Cart />, {
      preloadedState: emptyCartState
    });
    
    expect(CartEmpty).toHaveBeenCalled();
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
  });

  it('renders cart with items when cart has products', () => {
    renderWithProviders(<Cart />, {
      preloadedState: preloadedState
    });
    
    // Check if main cart elements are rendered
    expect(screen.getByTestId('cart-container')).toBeInTheDocument();
    expect(screen.getByTestId('cart-heading')).toBeInTheDocument();
    expect(screen.getByTestId('cart-items')).toBeInTheDocument();
    expect(screen.getByTestId('cart-summary')).toBeInTheDocument();
    
    // Check if cart items are rendered
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();
  });

  it('calculates and displays the correct subtotal', () => {
    renderWithProviders(<Cart />, {
      preloadedState: preloadedState
    });
    
    // Calculate expected subtotal: (80 * 2) + (40 * 1) = 200
    const expectedSubtotal = '$200.00';
    
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent(expectedSubtotal);
  });

  it('has working checkout button that links to checkout page', () => {
    renderWithProviders(<Cart />, {
      preloadedState: preloadedState
    });
    
    const checkoutButton = screen.getByTestId('checkout-button');
    expect(checkoutButton).toBeInTheDocument();
    
    // Check that the link points to the checkout page
    const parentLink = checkoutButton.closest('a');
    expect(parentLink).toHaveAttribute('href', '/checkout');
  });

  it('has working continue shopping link that points to products page', () => {
    renderWithProviders(<Cart />, {
      preloadedState: preloadedState
    });
    
    const continueShoppingLink = screen.getByTestId('continue-shopping-link');
    expect(continueShoppingLink).toBeInTheDocument();
    expect(continueShoppingLink).toHaveAttribute('href', '/products');
  });

  it('displays the correct number of cart items', () => {
    renderWithProviders(<Cart />, {
      preloadedState: preloadedState
    });
    
    // Check that we have rendered the exact number of cart items
    const cartItemsContainer = screen.getByTestId('cart-items');
    expect(cartItemsContainer.childElementCount).toBe(2);
  });

  it('renders the cart headers correctly', () => {
    renderWithProviders(<Cart />, {
      preloadedState: preloadedState
    });
    
    const tableHeader = screen.getByTestId('cart-table-header');
    expect(tableHeader).toBeInTheDocument();
    expect(tableHeader).toHaveTextContent('Product');
    expect(tableHeader).toHaveTextContent('Price');
    expect(tableHeader).toHaveTextContent('Quantity');
    expect(tableHeader).toHaveTextContent('Total');
  });
});