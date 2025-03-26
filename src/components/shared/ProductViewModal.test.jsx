import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, render } from '@testing-library/react';
import ProductViewModal from './ProductViewModal';

// Mock Headless UI components
vi.mock('@headlessui/react', () => ({
  Dialog: vi.fn(({ open, children, 'data-testid': testId }) => (
    open ? <div data-testid={testId}>{children}</div> : null
  )),
  DialogBackdrop: vi.fn(() => <div data-testid="modal-backdrop"></div>),
  DialogPanel: vi.fn(({ children, 'data-testid': testId }) => (
    <div data-testid={testId}>{children}</div>
  )),
  DialogTitle: vi.fn(({ children, as: Component = 'h2', 'data-testid': testId }) => (
    <Component data-testid={testId}>{children}</Component>
  )),
}));

// Mock MUI Divider
vi.mock('@mui/material', () => ({
  Divider: vi.fn(() => <hr data-testid="divider" />)
}));

// Mock Status component
vi.mock('./Status', () => ({
  default: vi.fn(({ text, bg, color, 'data-testid': testId }) => (
    <div data-testid={testId || 'status-component'} className={`${bg} ${color}`}>
      {text}
    </div>
  ))
}));

describe('ProductViewModal Component', () => {
  const mockSetOpen = vi.fn();
  
  const mockProduct = {
    id: 1,
    productName: 'Test Product',
    image: 'test-image.jpg',
    description: 'This is a test product description',
    quantity: 10,
    price: 100,
    discount: 20,
    specialPrice: 80
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('does not render when open is false', () => {
    render(
      <ProductViewModal 
        open={false} 
        setOpen={mockSetOpen} 
        product={mockProduct} 
        isAvailable={true} 
      />
    );
    
    expect(screen.queryByTestId('product-view-modal')).not.toBeInTheDocument();
  });
  
  it('renders when open is true', () => {
    render(
      <ProductViewModal 
        open={true} 
        setOpen={mockSetOpen} 
        product={mockProduct} 
        isAvailable={true} 
      />
    );
    
    expect(screen.getByTestId('product-view-modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-panel')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  });
  
  it('displays product details correctly', () => {
    render(
      <ProductViewModal 
        open={true} 
        setOpen={mockSetOpen} 
        product={mockProduct} 
        isAvailable={true} 
      />
    );
    
    expect(screen.getByTestId('modal-product-image')).toHaveAttribute('src', mockProduct.image);
    expect(screen.getByTestId('modal-product-image')).toHaveAttribute('alt', mockProduct.productName);
    expect(screen.getByTestId('modal-product-name')).toHaveTextContent(mockProduct.productName);
    expect(screen.getByTestId('modal-product-description')).toHaveTextContent(mockProduct.description);
  });
  
  it('displays special price when available', () => {
    render(
      <ProductViewModal 
        open={true} 
        setOpen={mockSetOpen} 
        product={mockProduct} 
        isAvailable={true} 
      />
    );
    
    expect(screen.getByTestId('special-price-container')).toBeInTheDocument();
    expect(screen.getByTestId('original-price')).toHaveTextContent(`$${mockProduct.price.toFixed(2)}`);
    expect(screen.getByTestId('special-price')).toHaveTextContent(`$${mockProduct.specialPrice.toFixed(2)}`);
  });
  
  it('displays regular price when no special price is available', () => {
    const productWithoutSpecialPrice = {
      ...mockProduct,
      specialPrice: null
    };
    
    render(
      <ProductViewModal 
        open={true} 
        setOpen={mockSetOpen} 
        product={productWithoutSpecialPrice} 
        isAvailable={true} 
      />
    );
    
    expect(screen.queryByTestId('special-price-container')).not.toBeInTheDocument();
    expect(screen.getByTestId('regular-price')).toHaveTextContent(`$${mockProduct.price.toFixed(2)}`);
  });
  
  it('shows "In Stock" status when isAvailable is true', () => {
    render(
      <ProductViewModal 
        open={true} 
        setOpen={mockSetOpen} 
        product={mockProduct} 
        isAvailable={true} 
      />
    );
    
    expect(screen.getByTestId('in-stock-status')).toHaveClass('bg-teal-200');
    expect(screen.getByTestId('in-stock-status')).toHaveTextContent('In Stock');
  });
  
  it('shows "Out-Of-Stock" status when isAvailable is false', () => {
    render(
      <ProductViewModal 
        open={true} 
        setOpen={mockSetOpen} 
        product={mockProduct} 
        isAvailable={false} 
      />
    );
    
    expect(screen.getByTestId('out-of-stock-status')).toHaveClass('bg-rose-200');
    expect(screen.getByTestId('out-of-stock-status')).toHaveTextContent('Out-Of-Stock');
  });
  
  it('calls setOpen(false) when close button is clicked', () => {
    render(
      <ProductViewModal 
        open={true} 
        setOpen={mockSetOpen} 
        product={mockProduct} 
        isAvailable={true} 
      />
    );
    
    const closeButton = screen.getByTestId('modal-close-button');
    fireEvent.click(closeButton);
    
    expect(mockSetOpen).toHaveBeenCalledTimes(1);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});