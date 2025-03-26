import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, render } from '@testing-library/react';
import { DeleteModal } from './DeleteModal';

// Mock Headless UI components
vi.mock('@headlessui/react', () => ({
  Dialog: vi.fn(({ open, onClose, children, className, 'data-testid': testId }) => (
    open ? <div data-testid={testId} className={className}>{children}</div> : null
  )),
  DialogBackdrop: vi.fn(({ children, transition, className, 'data-testid': testId }) => (
    <div data-testid={testId} className={className} data-transition={transition}>
      {children}
    </div>
  )),
  DialogPanel: vi.fn(({ children, transition, className, 'data-testid': testId }) => (
    <div data-testid={testId} className={className} data-transition={transition}>
      {children}
    </div>
  )),
  DialogTitle: vi.fn(({ children, as, className, 'data-testid': testId }) => (
    <h3 data-testid={testId} className={className}>{children}</h3>
  ))
}));

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaExclamationTriangle: vi.fn(() => <span data-testid="exclamation-icon">Warning Icon</span>),
  FaTimes: vi.fn(() => <span data-testid="times-icon">Close Icon</span>)
}));

describe('DeleteModal Component', () => {
  // Props
  const mockSetOpen = vi.fn();
  const mockOnDeleteHandler = vi.fn();
  const mockTitle = 'Delete Item';
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('does not render when open is false', () => {
    render(
      <DeleteModal 
        open={false} 
        setOpen={mockSetOpen}
        title={mockTitle}
        onDeleteHandler={mockOnDeleteHandler}
        loader={false}
      />
    );
    
    expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
  });
  
  it('renders the modal when open is true', () => {
    render(
      <DeleteModal 
        open={true} 
        setOpen={mockSetOpen}
        title={mockTitle}
        onDeleteHandler={mockOnDeleteHandler}
        loader={false}
      />
    );
    
    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    expect(screen.getByTestId('delete-modal-backdrop')).toBeInTheDocument();
    expect(screen.getByTestId('delete-modal-panel')).toBeInTheDocument();
  });
  
  it('displays the correct title', () => {
    render(
      <DeleteModal 
        open={true} 
        setOpen={mockSetOpen}
        title={mockTitle}
        onDeleteHandler={mockOnDeleteHandler}
        loader={false}
      />
    );
    
    expect(screen.getByTestId('delete-modal-title')).toHaveTextContent(mockTitle);
  });
  
  it('shows confirmation text', () => {
    render(
      <DeleteModal 
        open={true} 
        setOpen={mockSetOpen}
        title={mockTitle}
        onDeleteHandler={mockOnDeleteHandler}
        loader={false}
      />
    );
    
    expect(screen.getByTestId('delete-confirmation-text')).toHaveTextContent('Are you sure you want to delete?');
  });
  
  it('has delete and cancel buttons', () => {
    render(
      <DeleteModal 
        open={true} 
        setOpen={mockSetOpen}
        title={mockTitle}
        onDeleteHandler={mockOnDeleteHandler}
        loader={false}
      />
    );
    
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('close-button')).toBeInTheDocument();
  });
  
  it('shows "Delete" text on delete button when not loading', () => {
    render(
      <DeleteModal 
        open={true} 
        setOpen={mockSetOpen}
        title={mockTitle}
        onDeleteHandler={mockOnDeleteHandler}
        loader={false}
      />
    );
    
    expect(screen.getByTestId('delete-button')).toHaveTextContent('Delete');
  });
  
  it('shows "Loading..." text on delete button when loading', () => {
    render(
      <DeleteModal 
        open={true} 
        setOpen={mockSetOpen}
        title={mockTitle}
        onDeleteHandler={mockOnDeleteHandler}
        loader={true}
      />
    );
    
    expect(screen.getByTestId('delete-button')).toHaveTextContent('Loading...');
  });
  
  it('disables buttons when loader is true', () => {
    render(
      <DeleteModal 
        open={true} 
        setOpen={mockSetOpen}
        title={mockTitle}
        onDeleteHandler={mockOnDeleteHandler}
        loader={true}
      />
    );
    
    expect(screen.getByTestId('delete-button')).toBeDisabled();
    expect(screen.getByTestId('cancel-button')).toBeDisabled();
    expect(screen.getByTestId('close-button')).toBeDisabled();
  });
  
  it('calls onDeleteHandler when delete button is clicked', () => {
    render(
      <DeleteModal 
        open={true} 
        setOpen={mockSetOpen}
        title={mockTitle}
        onDeleteHandler={mockOnDeleteHandler}
        loader={false}
      />
    );
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(mockOnDeleteHandler).toHaveBeenCalledTimes(1);
  });
  
  it('calls setOpen(false) when cancel button is clicked', () => {
    render(
      <DeleteModal 
        open={true} 
        setOpen={mockSetOpen}
        title={mockTitle}
        onDeleteHandler={mockOnDeleteHandler}
        loader={false}
      />
    );
    
    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);
    
    expect(mockSetOpen).toHaveBeenCalledTimes(1);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
  
  it('calls setOpen(false) when close button is clicked', () => {
    render(
      <DeleteModal 
        open={true} 
        setOpen={mockSetOpen}
        title={mockTitle}
        onDeleteHandler={mockOnDeleteHandler}
        loader={false}
      />
    );
    
    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    
    expect(mockSetOpen).toHaveBeenCalledTimes(1);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});