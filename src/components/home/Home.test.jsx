import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Home from './Home';

// Mock components
vi.mock('./HomeBanner', () => ({
  default: vi.fn(() => <div data-testid="home-banner-mock">Banner Mock</div>)
}));

vi.mock('../shared/ProductCard', () => ({
  default: vi.fn(({ productId }) => (
    <div data-testid={`product-card-${productId}`}>Product Card {productId}</div>
  ))
}));

vi.mock('../shared/Loader', () => ({
  default: vi.fn(() => <div data-testid="loader-mock">Loading...</div>)
}));

// Mock useDispatch and fetchProducts
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch
  };
});

vi.mock('../../store/actions', () => ({
  fetchProducts: vi.fn()
}));

const mockDispatch = vi.fn();

describe('Home Component', () => {
  // Initial state with products and not loading
  const loadedState = {
    products: {
      products: [
        { productId: 1, productName: 'Product 1' },
        { productId: 2, productName: 'Product 2' },
        { productId: 3, productName: 'Product 3' },
        { productId: 4, productName: 'Product 4' },
        { productId: 5, productName: 'Product 5' }
      ]
    },
    errors: {
      isLoading: false,
      errorMessage: null
    }
  };

  // State with loading
  const loadingState = {
    products: {
      products: null
    },
    errors: {
      isLoading: true,
      errorMessage: null
    }
  };

  // State with error
  const errorState = {
    products: {
      products: null
    },
    errors: {
      isLoading: false,
      errorMessage: 'Failed to fetch products'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the home page container and banner', () => {
    renderWithProviders(<Home />, {
      preloadedState: loadedState
    });
    
    // Check that the main containers are rendered
    expect(screen.getByTestId('home-container')).toBeInTheDocument();
    expect(screen.getByTestId('home-banner-container')).toBeInTheDocument();
    expect(screen.getByTestId('home-banner-mock')).toBeInTheDocument();
    expect(screen.getByTestId('products-section')).toBeInTheDocument();
  });

  it('dispatches fetchProducts on component mount', () => {
    renderWithProviders(<Home />, {
      preloadedState: loadedState
    });
    
    // Check that the action was dispatched
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('renders loader when isLoading is true', () => {
    renderWithProviders(<Home />, {
      preloadedState: loadingState
    });
    
    expect(screen.getByTestId('loader-container')).toBeInTheDocument();
    expect(screen.getByTestId('loader-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('products-grid')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    renderWithProviders(<Home />, {
      preloadedState: errorState
    });
    
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.queryByTestId('products-grid')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loader-container')).not.toBeInTheDocument();
  });

  it('displays the error message text correctly', () => {
    renderWithProviders(<Home />, {
      preloadedState: errorState
    });
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveTextContent('Failed to fetch products');
  });

  it('renders products grid when products are loaded', () => {
    renderWithProviders(<Home />, {
      preloadedState: loadedState
    });
    
    expect(screen.getByTestId('products-grid')).toBeInTheDocument();
    expect(screen.queryByTestId('loader-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  it('shows up to 4 products in the featured section', () => {
    renderWithProviders(<Home />, {
      preloadedState: loadedState
    });
    
    // We should see 4 product cards, despite having 5 in the state
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-4')).toBeInTheDocument();
    
    // The 5th product should not be rendered
    expect(screen.queryByTestId('product-card-5')).not.toBeInTheDocument();
  });
  
  it('displays proper headings and text', () => {
    renderWithProviders(<Home />, {
      preloadedState: loadedState
    });
    
    expect(screen.getByTestId('products-heading')).toBeInTheDocument();
    expect(screen.getByTestId('products-heading')).toHaveTextContent('Products');
    expect(screen.getByText('Discover our handpicked selection of top-rated items just for you!')).toBeInTheDocument();
  });
});