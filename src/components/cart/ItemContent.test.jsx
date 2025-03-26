import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import ItemContent from './ItemContent';

// Mock components
vi.mock('./SetQuantity', () => ({
  default: vi.fn(({ quantity, handeQtyIncrease, handleQtyDecrease, productId }) => (
    <div data-testid={`quantity-selector-${productId}`}>
      <button data-testid={`decrease-button-${productId}`} onClick={handleQtyDecrease}>-</button>
      <span>{quantity}</span>
      <button data-testid={`increase-button-${productId}`} onClick={handeQtyIncrease}>+</button>
    </div>
  ))
}));

// Mock the dispatch function
const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch
  };
});

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock formatPrice
vi.mock('../../utils/formatPrice', () => ({
  formatPrice: vi.fn((amount) => `$${amount.toFixed(2)}`)
}));

// Mock truncateText
vi.mock('../../utils/truncateText', () => ({
  default: vi.fn((text) => text && text.length > 20 ? text.slice(0, 20) + '...' : text)
}));

describe('ItemContent Component', () => {
  const mockItem = {
    productId: 1,
    productName: 'Test Product',
    image: 'test-image.jpg',
    description: 'This is a test product description',
    quantity: 2,
    price: 100,
    discount: 20,
    specialPrice: 80,
    cartId: 'cart123'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the cart item correctly', () => {
    renderWithProviders(<ItemContent {...mockItem} />);
    
    // Check if main elements are rendered
    expect(screen.getByTestId(`cart-item-${mockItem.productId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`item-name-${mockItem.productId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`item-image-${mockItem.productId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`item-price-${mockItem.productId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`item-quantity-${mockItem.productId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`item-total-${mockItem.productId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`remove-button-${mockItem.productId}`)).toBeInTheDocument();
  });

  it('displays the correct product details', () => {
    renderWithProviders(<ItemContent {...mockItem} />);
    
    expect(screen.getByTestId(`item-name-${mockItem.productId}`)).toHaveTextContent(mockItem.productName);
    expect(screen.getByTestId(`item-image-${mockItem.productId}`)).toHaveAttribute('src', mockItem.image);
    expect(screen.getByTestId(`item-image-${mockItem.productId}`)).toHaveAttribute('alt', mockItem.productName);
    expect(screen.getByTestId(`item-price-${mockItem.productId}`)).toHaveTextContent(`$${mockItem.specialPrice.toFixed(2)}`);
    
    // Calculate expected total: (quantity * specialPrice)
    const expectedTotal = `$${(mockItem.quantity * mockItem.specialPrice).toFixed(2)}`;
    expect(screen.getByTestId(`item-total-${mockItem.productId}`)).toHaveTextContent(expectedTotal);
  });

  it('calls removeFromCart when remove button is clicked', () => {
    renderWithProviders(<ItemContent {...mockItem} />);
    
    const removeButton = screen.getByTestId(`remove-button-${mockItem.productId}`);
    fireEvent.click(removeButton);
    
    // Check if dispatch was called (removeFromCart action)
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('calls increaseCartQuantity when increase button is clicked', () => {
    renderWithProviders(<ItemContent {...mockItem} />);
    
    const increaseButton = screen.getByTestId(`increase-button-${mockItem.productId}`);
    fireEvent.click(increaseButton);
    
    // Check if dispatch was called (increaseCartQuantity action)
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('calls decreaseCartQuantity when decrease button is clicked', () => {
    renderWithProviders(<ItemContent {...mockItem} />);
    
    const decreaseButton = screen.getByTestId(`decrease-button-${mockItem.productId}`);
    fireEvent.click(decreaseButton);
    
    // Check if dispatch was called (decreaseCartQuantity action)
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});