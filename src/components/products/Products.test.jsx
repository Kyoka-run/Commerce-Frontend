import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Products from './Products';

// Mock the component dependencies
vi.mock('./Filter', () => ({
  default: vi.fn(({ categories }) => (
    <div data-testid="filter-mock">
      Filter Component (Categories: {categories.length})
    </div>
  ))
}));

vi.mock('../shared/ProductCard', () => ({
  default: vi.fn(({ productId, productName }) => (
    <div data-testid={`product-card-${productId}`}>
      {productName || `Product ${productId}`}
    </div>
  ))
}));

vi.mock('../shared/Loader', () => ({
  default: vi.fn(() => <div data-testid="loader-mock">Loading...</div>)
}));

vi.mock('../shared/Paginations', () => ({
  default: vi.fn(({ numberOfPage, totalProducts }) => (
    <div data-testid="pagination-mock">
      Pages: {numberOfPage}, Total: {totalProducts}
    </div>
  ))
}));

// Mock the custom hook
vi.mock('../../hooks/useProductFilter', () => ({
  default: vi.fn()
}));

// Mock the Redux actions
vi.mock('../../store/actions', () => ({
  fetchCategories: vi.fn()
}));

// Mock useDispatch
const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch
  };
});

describe('Products Component', () => {
  // States for different scenarios
  const loadingState = {
    products: {
      products: null,
      categories: [],
      pagination: {}
    },
    errors: {
      isLoading: true,
      errorMessage: null
    }
  };

  const errorState = {
    products: {
      products: null,
      categories: [],
      pagination: {}
    },
    errors: {
      isLoading: false,
      errorMessage: 'Failed to fetch products'
    }
  };

  const loadedState = {
    products: {
      products: [
        { productId: 1, productName: 'Product 1' },
        { productId: 2, productName: 'Product 2' },
        { productId: 3, productName: 'Product 3' }
      ],
      categories: [
        { categoryId: 1, categoryName: 'Category 1' },
        { categoryId: 2, categoryName: 'Category 2' }
      ],
      pagination: {
        totalPages: 3,
        totalElements: 15
      }
    },
    errors: {
      isLoading: false,
      errorMessage: null
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the products container and filter', () => {
    renderWithProviders(<Products />, {
      preloadedState: loadedState
    });
    
    expect(screen.getByTestId('products-container')).toBeInTheDocument();
    expect(screen.getByTestId('filter-mock')).toBeInTheDocument();
  });

  it('dispatches fetchCategories on component mount', () => {
    renderWithProviders(<Products />, {
      preloadedState: loadedState
    });
    
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('shows loader when isLoading is true', () => {
    renderWithProviders(<Products />, {
      preloadedState: loadingState
    });
    
    expect(screen.getByTestId('products-loader')).toBeInTheDocument();
    expect(screen.getByTestId('loader-mock')).toBeInTheDocument();
    
    // Other content should not be visible
    expect(screen.queryByTestId('products-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('products-error')).not.toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    renderWithProviders(<Products />, {
      preloadedState: errorState
    });
    
    expect(screen.getByTestId('products-error')).toBeInTheDocument();
    expect(screen.getByTestId('products-error')).toHaveTextContent('Failed to fetch products');
    
    // Other content should not be visible
    expect(screen.queryByTestId('products-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('products-loader')).not.toBeInTheDocument();
  });

  it('renders products grid when products are loaded', () => {
    renderWithProviders(<Products />, {
      preloadedState: loadedState
    });
    
    expect(screen.getByTestId('products-content')).toBeInTheDocument();
    expect(screen.getByTestId('products-grid')).toBeInTheDocument();
    
    // Should render a ProductCard for each product
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
  });

  it('renders pagination when products are loaded', () => {
    renderWithProviders(<Products />, {
      preloadedState: loadedState
    });
    
    expect(screen.getByTestId('products-pagination')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-mock')).toBeInTheDocument();
    
    // Check that pagination is rendered with correct props
    expect(screen.getByTestId('pagination-mock')).toHaveTextContent('Pages: 3');
    expect(screen.getByTestId('pagination-mock')).toHaveTextContent('Total: 15');
  });

  it('passes categories to Filter component', () => {
    renderWithProviders(<Products />, {
      preloadedState: loadedState
    });
    
    // Check that the Filter component received the categories
    expect(screen.getByTestId('filter-mock')).toHaveTextContent('Categories: 2');
  });
});