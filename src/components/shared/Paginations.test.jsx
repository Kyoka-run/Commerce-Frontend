import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Paginations from './Paginations';

// Mock Material UI components
vi.mock('@mui/material', () => ({
  Pagination: vi.fn(({ count, page, onChange, 'data-testid': testId }) => (
    <div data-testid={testId}>
      <span data-testid="page-count">Count: {count}</span>
      <span data-testid="current-page">Current: {page}</span>
      <button data-testid="prev-page" onClick={() => onChange(null, page - 1)} disabled={page <= 1}>
        Previous
      </button>
      <button data-testid="next-page" onClick={() => onChange(null, page + 1)} disabled={page >= count}>
        Next
      </button>
    </div>
  ))
}));

// Create a mock function that we can change in tests
const useSearchParamsMock = vi.fn().mockReturnValue([
  new URLSearchParams({ page: '2', category: 'phones' }),
  vi.fn()
]);

// Mock router hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/products' }),
    useNavigate: () => mockNavigate,
    useSearchParams: () => useSearchParamsMock() // Use the function reference so we can modify it
  };
});

describe('Paginations Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock to default value for each test
    useSearchParamsMock.mockReturnValue([
      new URLSearchParams({ page: '2', category: 'phones' }),
      vi.fn()
    ]);
  });

  it('renders the pagination container', () => {
    renderWithProviders(<Paginations numberOfPage={5} totalProducts={25} />);
    
    expect(screen.getByTestId('pagination-container')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-component')).toBeInTheDocument();
  });

  it('displays the correct page count and current page', () => {
    renderWithProviders(<Paginations numberOfPage={5} totalProducts={25} />);
    
    expect(screen.getByTestId('page-count')).toHaveTextContent('Count: 5');
    expect(screen.getByTestId('current-page')).toHaveTextContent('Current: 2');
  });

  it('navigates to the previous page when previous button is clicked', () => {
    renderWithProviders(<Paginations numberOfPage={5} totalProducts={25} />);
    
    const prevButton = screen.getByTestId('prev-page');
    fireEvent.click(prevButton);
    
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/products?page=1&category=phones');
  });

  it('navigates to the next page when next button is clicked', () => {
    renderWithProviders(<Paginations numberOfPage={5} totalProducts={25} />);
    
    const nextButton = screen.getByTestId('next-page');
    fireEvent.click(nextButton);
    
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/products?page=3&category=phones');
  });

  it('uses page 1 as default when page param is not in URL', () => {
    useSearchParamsMock.mockReturnValue([
      new URLSearchParams({ category: 'phones' }),
      vi.fn()
    ]);
    
    renderWithProviders(<Paginations numberOfPage={5} totalProducts={25} />);
    
    expect(screen.getByTestId('current-page')).toHaveTextContent('Current: 1');
  });

  it('preserves existing query parameters when changing pages', () => {
    useSearchParamsMock.mockReturnValue([
      new URLSearchParams({ page: '2', category: 'phones', sortby: 'desc', keyword: 'iphone' }),
      vi.fn()
    ]);
    
    renderWithProviders(<Paginations numberOfPage={5} totalProducts={25} />);
    
    const nextButton = screen.getByTestId('next-page');
    fireEvent.click(nextButton);
    
    // Should preserve all existing params
    expect(mockNavigate).toHaveBeenCalledWith('/products?page=3&category=phones&sortby=desc&keyword=iphone');
  });

  it('disables previous button on the first page', () => {
    useSearchParamsMock.mockReturnValue([
      new URLSearchParams({ page: '1', category: 'phones' }),
      vi.fn()
    ]);
    
    renderWithProviders(<Paginations numberOfPage={5} totalProducts={25} />);
    
    const prevButton = screen.getByTestId('prev-page');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on the last page', () => {
    useSearchParamsMock.mockReturnValue([
      new URLSearchParams({ page: '5', category: 'phones' }),
      vi.fn()
    ]);
    
    renderWithProviders(<Paginations numberOfPage={5} totalProducts={25} />);
    
    const nextButton = screen.getByTestId('next-page');
    expect(nextButton).toBeDisabled();
  });
});