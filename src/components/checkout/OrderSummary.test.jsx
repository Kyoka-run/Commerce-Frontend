import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, render } from '@testing-library/react';
import OrderSummary from './OrderSummary';

// Mock formatPriceCalculation
vi.mock('../../utils/formatPrice', () => ({
  formatPriceCalculation: vi.fn((amount) => amount.toFixed(2))
}));

// Mock environment variable
vi.mock('import.meta', () => ({
  env: { VITE_BACK_END_URL: 'http://testserver' }
}));

describe('OrderSummary Component', () => {
  const mockAddress = {
    addressId: 1,
    city: 'Test City',
    street: 'Test Street',
    postcode: '12345',
    country: 'Test Country'
  };
  
  const mockCart = [
    {
      productId: 1,
      productName: 'Test Product 1',
      image: 'test-image-1.jpg',
      quantity: 2,
      specialPrice: 100
    },
    {
      productId: 2,
      productName: 'Test Product 2',
      image: 'test-image-2.jpg',
      quantity: 1,
      specialPrice: 50
    }
  ];
  
  const mockPaymentMethod = 'Stripe';
  const mockTotalPrice = 250;
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the order summary container with all sections', () => {
    render(
      <OrderSummary 
        totalPrice={mockTotalPrice}
        cart={mockCart}
        address={mockAddress}
        paymentMethod={mockPaymentMethod}
      />
    );
    
    expect(screen.getByTestId('order-summary-container')).toBeInTheDocument();
    expect(screen.getByTestId('billing-address-section')).toBeInTheDocument();
    expect(screen.getByTestId('payment-method-section')).toBeInTheDocument();
    expect(screen.getByTestId('order-items-section')).toBeInTheDocument();
    expect(screen.getByTestId('order-summary-section')).toBeInTheDocument();
  });
  
  it('displays billing address details correctly', () => {
    render(
      <OrderSummary 
        totalPrice={mockTotalPrice}
        cart={mockCart}
        address={mockAddress}
        paymentMethod={mockPaymentMethod}
      />
    );
    
    expect(screen.getByTestId('address-city')).toHaveTextContent(`City: ${mockAddress.city}`);
    expect(screen.getByTestId('address-street')).toHaveTextContent(`Street: ${mockAddress.street}`);
    expect(screen.getByTestId('address-postcode')).toHaveTextContent(`Postcode: ${mockAddress.postcode}`);
    expect(screen.getByTestId('address-country')).toHaveTextContent(`Country: ${mockAddress.country}`);
  });
  
  it('displays payment method correctly', () => {
    render(
      <OrderSummary 
        totalPrice={mockTotalPrice}
        cart={mockCart}
        address={mockAddress}
        paymentMethod={mockPaymentMethod}
      />
    );
    
    expect(screen.getByTestId('payment-method-value')).toHaveTextContent(`Method: ${mockPaymentMethod}`);
  });
  
  it('renders all order items from cart', () => {
    render(
      <OrderSummary 
        totalPrice={mockTotalPrice}
        cart={mockCart}
        address={mockAddress}
        paymentMethod={mockPaymentMethod}
      />
    );
    
    // Check that both items are rendered
    expect(screen.getByTestId('order-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('order-item-2')).toBeInTheDocument();
    
    // Check item 1 details
    expect(screen.getByTestId('item-name-1')).toHaveTextContent(mockCart[0].productName);
    expect(screen.getByTestId('item-price-1')).toHaveTextContent(`${mockCart[0].quantity} x $${mockCart[0].specialPrice}`);
    expect(screen.getByTestId('item-image-1')).toHaveAttribute('src', `http://localhost:8080/images/${mockCart[0].image}`);
    
    // Check item 2 details
    expect(screen.getByTestId('item-name-2')).toHaveTextContent(mockCart[1].productName);
    expect(screen.getByTestId('item-price-2')).toHaveTextContent(`${mockCart[1].quantity} x $${mockCart[1].specialPrice}`);
    expect(screen.getByTestId('item-image-2')).toHaveAttribute('src', `http://localhost:8080/images/${mockCart[1].image}`);
  });
  
  it('displays correct price calculations in order summary', () => {
    render(
      <OrderSummary 
        totalPrice={mockTotalPrice}
        cart={mockCart}
        address={mockAddress}
        paymentMethod={mockPaymentMethod}
      />
    );
    
    // formatPriceCalculation is mocked to just return the fixed value
    expect(screen.getByTestId('products-total')).toHaveTextContent(`$${mockTotalPrice.toFixed(2)}`);
    expect(screen.getByTestId('tax-amount')).toHaveTextContent('$0.00');
    expect(screen.getByTestId('subtotal-amount')).toHaveTextContent(`$${mockTotalPrice.toFixed(2)}`);
  });
  
  it('handles missing or undefined values gracefully', () => {
    render(
      <OrderSummary 
        totalPrice={0}
        cart={[]}
        address={null}
        paymentMethod={null}
      />
    );
    
    // Should render without errors even with missing data
    expect(screen.getByTestId('order-summary-container')).toBeInTheDocument();
    expect(screen.getByTestId('billing-address-section')).toBeInTheDocument();
    
    // Address fields should be empty but not crash
    expect(screen.getByTestId('address-city')).toHaveTextContent('City:');
    expect(screen.getByTestId('address-street')).toHaveTextContent('Street:');
    expect(screen.getByTestId('address-postcode')).toHaveTextContent('Postcode:');
    expect(screen.getByTestId('address-country')).toHaveTextContent('Country:');
    
    // Payment method should be empty
    expect(screen.getByTestId('payment-method-value')).toHaveTextContent('Method:');
    
    // No order items should be shown
    expect(screen.queryByTestId(/^order-item-/)).not.toBeInTheDocument();
    
    // Totals should show zero
    expect(screen.getByTestId('products-total')).toHaveTextContent('$0.00');
    expect(screen.getByTestId('subtotal-amount')).toHaveTextContent('$0.00');
  });
});