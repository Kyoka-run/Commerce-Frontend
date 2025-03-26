import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import About from './About';

// Mock the ProductCard component
vi.mock('./shared/ProductCard', () => ({
  default: vi.fn(({ productName, description, about }) => (
    <div data-testid={`product-card-${productName}`}>
      <h3>{productName}</h3>
      <p>{description}</p>
      <span>About mode: {about ? 'true' : 'false'}</span>
    </div>
  ))
}));

describe('About Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the about container and headings', () => {
    renderWithProviders(<About />);
    
    // Check if the main elements are rendered
    expect(screen.getByTestId('about-container')).toBeInTheDocument();
    expect(screen.getByTestId('about-heading')).toBeInTheDocument();
    expect(screen.getByTestId('about-intro')).toBeInTheDocument();
    expect(screen.getByTestId('products-showcase')).toBeInTheDocument();
    expect(screen.getByTestId('products-heading')).toBeInTheDocument();
    expect(screen.getByTestId('product-cards-container')).toBeInTheDocument();
  });

  it('displays the correct headings and text', () => {
    renderWithProviders(<About />);
    
    expect(screen.getByTestId('about-heading')).toHaveTextContent('About Us');
    expect(screen.getByTestId('about-description')).toHaveTextContent(
      'Welcome to our e-commerce store! We are dedicated to providing the best products and services to our customers.'
    );
    expect(screen.getByTestId('products-heading')).toHaveTextContent('Our Products');
  });

  it('renders the about image', () => {
    renderWithProviders(<About />);
    
    const aboutImage = screen.getByTestId('about-image');
    expect(aboutImage).toBeInTheDocument();
    expect(aboutImage).toHaveAttribute('src', 'https://embarkx.com/sample/placeholder.png');
    expect(aboutImage).toHaveAttribute('alt', 'About Us');
  });

  it('renders three product cards in about mode', () => {
    renderWithProviders(<About />);
    
    // Check that we have three product cards
    expect(screen.getByTestId('product-card-iPhone 13 Pro Max')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-Samsung Galaxy S21')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-Google Pixel 6')).toBeInTheDocument();
    
    // Verify the content of the product cards
    expect(screen.getByTestId('product-card-iPhone 13 Pro Max')).toHaveTextContent('iPhone 13 Pro Max');
    expect(screen.getByTestId('product-card-Samsung Galaxy S21')).toHaveTextContent('Samsung Galaxy S21');
    expect(screen.getByTestId('product-card-Google Pixel 6')).toHaveTextContent('Google Pixel 6');
    
    // Verify that all cards are in 'about' mode
    expect(screen.getByTestId('product-card-iPhone 13 Pro Max')).toHaveTextContent('About mode: true');
    expect(screen.getByTestId('product-card-Samsung Galaxy S21')).toHaveTextContent('About mode: true');
    expect(screen.getByTestId('product-card-Google Pixel 6')).toHaveTextContent('About mode: true');
  });

  it('passes the correct props to product cards', () => {
    renderWithProviders(<About />);
    
    // Check descriptions are passed correctly to the product cards
    expect(screen.getByTestId('product-card-iPhone 13 Pro Max')).toHaveTextContent(
      'The iPhone 13 Pro Max offers exceptional performance with its A15 Bionic chip'
    );
    expect(screen.getByTestId('product-card-Samsung Galaxy S21')).toHaveTextContent(
      'Experience the brilliance of the Samsung Galaxy S21 with its vibrant AMOLED display'
    );
    expect(screen.getByTestId('product-card-Google Pixel 6')).toHaveTextContent(
      'The Google Pixel 6 boasts cutting-edge AI features, exceptional photo quality'
    );
  });
});