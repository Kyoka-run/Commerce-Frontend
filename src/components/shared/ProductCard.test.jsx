import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import ProductCard from './ProductCard';

// Mock redux dispatch
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch
  };
});

// Mock the toast notifications
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

const mockDispatch = vi.fn();

describe('ProductCard Component', () => {
  const mockProduct = {
    productId: 1,
    productName: 'Test Product',
    image: 'test-image.jpg',
    description: 'This is a test product description that is long enough to be truncated',
    quantity: 10,
    price: 99.99,
    discount: 10,
    specialPrice: 89.99
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the product card correctly', () => {
    renderWithProviders(<ProductCard {...mockProduct} />);
    
    // Check if the main elements are rendered
    expect(screen.getByTestId(`product-card-${mockProduct.productId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`product-image-${mockProduct.productId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`product-name-${mockProduct.productId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`product-description-${mockProduct.productId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`product-price-${mockProduct.productId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`add-to-cart-${mockProduct.productId}`)).toBeInTheDocument();
  });

  it('displays the product name correctly', () => {
    renderWithProviders(<ProductCard {...mockProduct} />);
    
    const productName = screen.getByTestId(`product-name-${mockProduct.productId}`);
    expect(productName.textContent).toBe(mockProduct.productName);
  });

  it('displays the product price correctly when there is a special price', () => {
    renderWithProviders(<ProductCard {...mockProduct} />);
    
    const priceElement = screen.getByTestId(`product-price-${mockProduct.productId}`);
    expect(priceElement.textContent).toContain(`$${Number(mockProduct.price).toFixed(2)}`);
    expect(priceElement.textContent).toContain(`$${Number(mockProduct.specialPrice).toFixed(2)}`);
  });

  it('displays regular price when no special price is provided', () => {
    const productWithoutSpecialPrice = {
      ...mockProduct,
      specialPrice: null
    };
    
    renderWithProviders(<ProductCard {...productWithoutSpecialPrice} />);
    
    const priceElement = screen.getByTestId(`product-price-${mockProduct.productId}`);
    expect(priceElement.textContent.trim()).toBe(`$${Number(mockProduct.price).toFixed(2)}`);
  });

  it('displays "Stock Out" and disables the button when quantity is 0', () => {
    const outOfStockProduct = {
      ...mockProduct,
      quantity: 0
    };
    
    renderWithProviders(<ProductCard {...outOfStockProduct} />);
    
    const addToCartButton = screen.getByTestId(`add-to-cart-${mockProduct.productId}`);
    expect(addToCartButton).toBeDisabled();
    expect(addToCartButton.textContent).toContain('Stock Out');
  });

  it('dispatches addToCart action when "Add to Cart" button is clicked', () => {
    renderWithProviders(<ProductCard {...mockProduct} />);
    
    const addToCartButton = screen.getByTestId(`add-to-cart-${mockProduct.productId}`);
    fireEvent.click(addToCartButton);
    
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('renders in "about" mode without "Add to Cart" button', () => {
    renderWithProviders(<ProductCard {...mockProduct} about={true} />);
    
    // Check that the add to cart button is not rendered
    expect(screen.queryByTestId(`add-to-cart-${mockProduct.productId}`)).not.toBeInTheDocument();
  });
});