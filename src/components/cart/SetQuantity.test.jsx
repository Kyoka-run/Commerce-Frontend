import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@testing-library/react';
import SetQuantity from './SetQuantity';

describe('SetQuantity Component', () => {
  const mockProps = {
    quantity: 2,
    cardCounter: true,
    handeQtyIncrease: vi.fn(),
    handleQtyDecrease: vi.fn(),
    productId: 1
  };

  it('renders the quantity selector correctly', () => {
    render(<SetQuantity {...mockProps} />);
    
    // Check if main elements are rendered
    expect(screen.getByTestId(`quantity-selector-${mockProps.productId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`decrease-button-${mockProps.productId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`quantity-value-${mockProps.productId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`increase-button-${mockProps.productId}`)).toBeInTheDocument();
  });

  it('displays the correct quantity value', () => {
    render(<SetQuantity {...mockProps} />);
    
    expect(screen.getByTestId(`quantity-value-${mockProps.productId}`)).toHaveTextContent('2');
  });

  it('calls handeQtyIncrease when increase button is clicked', () => {
    render(<SetQuantity {...mockProps} />);
    
    const increaseButton = screen.getByTestId(`increase-button-${mockProps.productId}`);
    fireEvent.click(increaseButton);
    
    expect(mockProps.handeQtyIncrease).toHaveBeenCalledTimes(1);
  });

  it('calls handleQtyDecrease when decrease button is clicked', () => {
    render(<SetQuantity {...mockProps} />);
    
    const decreaseButton = screen.getByTestId(`decrease-button-${mockProps.productId}`);
    fireEvent.click(decreaseButton);
    
    expect(mockProps.handleQtyDecrease).toHaveBeenCalledTimes(1);
  });

  it('disables decrease button when quantity is 1', () => {
    render(<SetQuantity {...mockProps, {quantity: 1}} />);
    
    const decreaseButton = screen.getByTestId(`decrease-button-${mockProps.productId}`);
    expect(decreaseButton).toBeDisabled();
  });

  it('enables decrease button when quantity is greater than 1', () => {
    render(<SetQuantity {...mockProps} />);
    
    const decreaseButton = screen.getByTestId(`decrease-button-${mockProps.productId}`);
    expect(decreaseButton).not.toBeDisabled();
  });

  it('shows QUANTITY label when cardCounter is false', () => {
    render(<SetQuantity {...mockProps, {cardCounter: false}} />);
    
    expect(screen.getByText('QUANTITY')).toBeInTheDocument();
  });

  it('hides QUANTITY label when cardCounter is true', () => {
    render(<SetQuantity {...mockProps} />);
    
    expect(screen.queryByText('QUANTITY')).not.toBeInTheDocument();
  });

  it('uses default ID when productId is not provided', () => {
    const propsWithoutId = {
      ...mockProps,
      productId: undefined
    };
    
    render(<SetQuantity {...propsWithoutId} />);
    
    expect(screen.getByTestId('quantity-selector-default')).toBeInTheDocument();
  });
});