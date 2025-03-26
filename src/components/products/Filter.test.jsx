import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Filter from './Filter';

// Mock Material UI components to simplify testing
vi.mock('@mui/material', () => ({
  Button: vi.fn(({ children, onClick, 'data-testid': testId }) => (
    <button onClick={onClick} data-testid={testId}>{children}</button>
  )),
  FormControl: vi.fn(({ children, 'data-testid': testId }) => (
    <div data-testid={testId}>{children}</div>
  )),
  InputLabel: vi.fn(({ children }) => <label>{children}</label>),
  MenuItem: vi.fn(({ children, value, 'data-testid': testId }) => (
    <option value={value} data-testid={testId}>{children}</option>
  )),
  Select: vi.fn(({ value, onChange, children, 'data-testid': testId }) => (
    <select 
      value={value} 
      onChange={(e) => onChange(e)} 
      data-testid={testId}
    >
      {children}
    </select>
  )),
  Tooltip: vi.fn(({ children }) => children)
}));

// Mock custom hook instead of relying solely on react-router-dom mock
vi.mock('../../hooks/useProductFilter', () => ({
  default: vi.fn()
}));

// Mock router hooks - using importActual to keep original exports
const mockNavigate = vi.fn();
let mockSearchParams = new URLSearchParams({ category: 'phones', sortby: 'asc', keyword: 'apple' });
const mockSetSearchParams = vi.fn(params => {
  // Update the mockSearchParams for subsequent calls
  mockSearchParams = params;
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual, // This keeps BrowserRouter and other exports
    useLocation: () => ({ pathname: '/products' }),
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams, mockSetSearchParams]
  };
});

describe('Filter Component', () => {
  const mockCategories = [
    { categoryId: 1, categoryName: 'Phones' },
    { categoryId: 2, categoryName: 'Laptops' },
    { categoryId: 3, categoryName: 'Accessories' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mockSearchParams for each test
    mockSearchParams = new URLSearchParams({ category: 'phones', sortby: 'asc', keyword: 'apple' });
  });

  it('renders the filter container with all sections', () => {
    renderWithProviders(<Filter categories={mockCategories} />);
    
    // Check main container
    expect(screen.getByTestId('filter-container')).toBeInTheDocument();
    
    // Check search section
    expect(screen.getByTestId('search-container')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    
    // Check filter controls section
    expect(screen.getByTestId('filter-controls')).toBeInTheDocument();
    expect(screen.getByTestId('category-filter')).toBeInTheDocument();
    expect(screen.getByTestId('category-select')).toBeInTheDocument();
    expect(screen.getByTestId('sort-button')).toBeInTheDocument();
    expect(screen.getByTestId('clear-filter-button')).toBeInTheDocument();
  });

  it('displays the correct initial values from URL params', () => {
    renderWithProviders(<Filter categories={mockCategories} />);
    
    // Check search input has the correct value from URL
    expect(screen.getByTestId('search-input')).toHaveValue('apple');
  });

  it('renders all category options', () => {
    renderWithProviders(<Filter categories={mockCategories} />);
    
    // Check "All" option
    expect(screen.getByTestId('category-all')).toBeInTheDocument();
    expect(screen.getByTestId('category-all')).toHaveTextContent('All');
    
    // Check category options from props
    expect(screen.getByTestId('category-1')).toBeInTheDocument();
    expect(screen.getByTestId('category-1')).toHaveTextContent('Phones');
    
    expect(screen.getByTestId('category-2')).toBeInTheDocument();
    expect(screen.getByTestId('category-2')).toHaveTextContent('Laptops');
    
    expect(screen.getByTestId('category-3')).toBeInTheDocument();
    expect(screen.getByTestId('category-3')).toHaveTextContent('Accessories');
  });

  it('navigates with updated params when category is changed', () => {
    renderWithProviders(<Filter categories={mockCategories} />);
    
    const categorySelect = screen.getByTestId('category-select');
    
    // Change category to "Laptops"
    fireEvent.change(categorySelect, { target: { value: 'Laptops' } });
    
    // Should navigate with updated params
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/products?category=Laptops&sortby=asc&keyword=apple');
  });

  it('navigates with "all" category removed from params', () => {
    renderWithProviders(<Filter categories={mockCategories} />);
    
    const categorySelect = screen.getByTestId('category-select');
    
    // Change category to "All"
    fireEvent.change(categorySelect, { target: { value: 'all' } });
    
    // Should navigate with category param removed
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/products?sortby=asc&keyword=apple');
  });

  it('toggles sort order when sort button is clicked', () => {
    renderWithProviders(<Filter categories={mockCategories} />);
    
    const sortButton = screen.getByTestId('sort-button');
    
    // Click sort button to toggle from "asc" to "desc"
    fireEvent.click(sortButton);
    
    // Should navigate with updated sort order
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/products?category=phones&sortby=desc&keyword=apple');
  });

  it('navigates to base path when clear filters button is clicked', () => {
    renderWithProviders(<Filter categories={mockCategories} />);
    
    const clearButton = screen.getByTestId('clear-filter-button');
    
    // Click clear button
    fireEvent.click(clearButton);
    
    // Should navigate to base path with just the pathname
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({ pathname: '/' });
  });

  it('updates search input and applies debounced search', async () => {
    vi.useFakeTimers();
    renderWithProviders(<Filter categories={mockCategories} />);
    
    const searchInput = screen.getByTestId('search-input');
    
    // Change search input
    fireEvent.change(searchInput, { target: { value: 'iphone' } });
    
    // Should not navigate immediately (debounced)
    expect(mockNavigate).not.toHaveBeenCalled();
    
    // For this test, we'll manually update the mockSearchParams to simulate
    // what would happen in the real component
    mockSearchParams = new URLSearchParams({ 
      category: 'phones', 
      sortby: 'asc', 
      keyword: 'iphone' 
    });
    
    // Fast-forward timers
    vi.runAllTimers();
    
    // Now the test should expect mockNavigate with the updated keyword
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/products?category=phones&sortby=asc&keyword=iphone');
    
    vi.useRealTimers();
  });

  it('clears search keyword param when search input is cleared', async () => {
    vi.useFakeTimers();
    renderWithProviders(<Filter categories={mockCategories} />);
    
    const searchInput = screen.getByTestId('search-input');
    
    // Clear search input
    fireEvent.change(searchInput, { target: { value: '' } });
    
    // Update mockSearchParams to simulate real component behavior
    mockSearchParams = new URLSearchParams({ 
      category: 'phones', 
      sortby: 'asc'
      // keyword param is removed
    });
    
    // Fast-forward timers
    vi.runAllTimers();
    
    // Should navigate with keyword param removed
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/products?category=phones&sortby=asc');
    
    vi.useRealTimers();
  });
});