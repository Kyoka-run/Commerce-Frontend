import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import CartEmpty from './CartEmpty';

describe('CartEmpty Component', () => {
  it('renders the empty cart message correctly', () => {
    renderWithProviders(<CartEmpty />);
    
    // Check if main elements are rendered
    expect(screen.getByTestId('cart-empty-container')).toBeInTheDocument();
    expect(screen.getByTestId('empty-cart-heading')).toBeInTheDocument();
    expect(screen.getByTestId('start-shopping-link')).toBeInTheDocument();
  });

  it('displays the correct empty cart message', () => {
    renderWithProviders(<CartEmpty />);
    
    expect(screen.getByTestId('empty-cart-heading')).toHaveTextContent('Your cart is empty');
  });

  it('has a working start shopping link that directs to home page', () => {
    renderWithProviders(<CartEmpty />);
    
    const startShoppingLink = screen.getByTestId('start-shopping-link');
    expect(startShoppingLink).toHaveAttribute('href', '/');
    expect(startShoppingLink).toHaveTextContent('Start Shopping');
  });
});