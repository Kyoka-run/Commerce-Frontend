import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import AddressInfo from './AddressInfo';

// Mock dependencies
vi.mock('../shared/Skeleton', () => ({
  default: vi.fn(() => <div data-testid="skeleton-mock">Loading...</div>)
}));

vi.mock('./AddressInfoModal', () => ({
  default: vi.fn(({ children, open, setOpen }) => open ? (
    <div data-testid="address-modal-mock">{children}</div>
  ) : null)
}));

vi.mock('./AddAddressForm', () => ({
  default: vi.fn(({ address, setOpenAddressModal }) => (
    <div data-testid="address-form-mock">
      Address Form {address ? 'Edit' : 'Add'}
      <button 
        onClick={() => setOpenAddressModal(false)}
        data-testid="close-form-button"
      >
        Close
      </button>
    </div>
  ))
}));

vi.mock('./AddressList', () => ({
  default: vi.fn(({ addresses, setSelectedAddress, setOpenAddressModal, setOpenDeleteModal }) => (
    <div data-testid="address-list-mock">
      {addresses.map(address => (
        <div key={address.addressId} data-testid={`address-item-${address.addressId}`}>
          {address.city}, {address.street}
          <button 
            onClick={() => {
              setSelectedAddress(address);
              setOpenAddressModal(true);
            }}
            data-testid={`edit-address-${address.addressId}`}
          >
            Edit
          </button>
          <button 
            onClick={() => {
              setSelectedAddress(address);
              setOpenDeleteModal(true);
            }}
            data-testid={`delete-address-${address.addressId}`}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  ))
}));

// Mock the DeleteModal - fix the export naming to match the import in AddressInfo
vi.mock('./DeleteModal', () => {
  const DeleteModal = vi.fn(({ open, setOpen, title, onDeleteHandler }) => open ? (
    <div data-testid="delete-modal-mock">
      {title}
      <button 
        onClick={onDeleteHandler}
        data-testid="confirm-delete-button"
      >
        Delete
      </button>
      <button 
        onClick={() => setOpen(false)}
        data-testid="cancel-delete-button"
      >
        Cancel
      </button>
    </div>
  ) : null);
  
  return { DeleteModal };
});

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaAddressBook: vi.fn(() => <div data-testid="address-book-icon"></div>)
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock Redux dispatch
const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: vi.fn().mockImplementation(selector => {
      // Mock state for testing
      const state = {
        errors: { isLoading: false, btnLoader: false }
      };
      return selector(state);
    })
  };
});

// Mock actions
vi.mock('../../store/actions', () => ({
  deleteUserAddress: vi.fn((toast, addressId, setOpenDeleteModal) => ({ 
    type: 'DELETE_USER_ADDRESS', 
    payload: addressId 
  }))
}));

describe('AddressInfo Component', () => {
  // Test data
  const mockAddresses = [
    { addressId: 1, city: 'City 1', street: 'Street 1', postcode: '12345', country: 'Country 1' },
    { addressId: 2, city: 'City 2', street: 'Street 2', postcode: '67890', country: 'Country 2' }
  ];
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the address info container', () => {
    renderWithProviders(<AddressInfo address={mockAddresses} />);
    
    expect(screen.getByTestId('address-info-container')).toBeInTheDocument();
  });
  
  it('shows "no address" view when no addresses exist', () => {
    renderWithProviders(<AddressInfo address={[]} />);
    
    expect(screen.getByTestId('no-address-view')).toBeInTheDocument();
    expect(screen.getByTestId('no-address-title')).toHaveTextContent('No Address Added Yet');
    expect(screen.getByTestId('add-address-button')).toBeInTheDocument();
  });
  
  it('shows address list view when addresses exist', () => {
    renderWithProviders(<AddressInfo address={mockAddresses} />);
    
    expect(screen.getByTestId('address-list-view')).toBeInTheDocument();
    expect(screen.getByTestId('address-list-title')).toHaveTextContent('Select Address');
    expect(screen.getByTestId('address-list-container')).toBeInTheDocument();
    expect(screen.getByTestId('address-list-mock')).toBeInTheDocument();
  });
  
  it('opens address form modal when "Add Address" button is clicked', () => {
    renderWithProviders(<AddressInfo address={[]} />);
    
    const addButton = screen.getByTestId('add-address-button');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('address-modal-mock')).toBeInTheDocument();
    expect(screen.getByTestId('address-form-mock')).toBeInTheDocument();
    expect(screen.getByTestId('address-form-mock')).toHaveTextContent('Address Form Add');
  });
  
  it('opens address form modal when "Add More" button is clicked', () => {
    renderWithProviders(<AddressInfo address={mockAddresses} />);
    
    const addMoreButton = screen.getByTestId('add-more-button');
    fireEvent.click(addMoreButton);
    
    expect(screen.getByTestId('address-modal-mock')).toBeInTheDocument();
    expect(screen.getByTestId('address-form-mock')).toBeInTheDocument();
    expect(screen.getByTestId('address-form-mock')).toHaveTextContent('Address Form Add');
  });
  
  it('opens address form modal in edit mode when edit button is clicked', () => {
    renderWithProviders(<AddressInfo address={mockAddresses} />);
    
    const editButton = screen.getByTestId('edit-address-1');
    fireEvent.click(editButton);
    
    expect(screen.getByTestId('address-modal-mock')).toBeInTheDocument();
    expect(screen.getByTestId('address-form-mock')).toBeInTheDocument();
    expect(screen.getByTestId('address-form-mock')).toHaveTextContent('Address Form Edit');
  });
  
  it('opens delete modal when delete button is clicked', () => {
    renderWithProviders(<AddressInfo address={mockAddresses} />);
    
    const deleteButton = screen.getByTestId('delete-address-1');
    fireEvent.click(deleteButton);
    
    expect(screen.getByTestId('delete-modal-mock')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-delete-button')).toBeInTheDocument();
  });
  
  it('dispatches deleteUserAddress action when delete is confirmed', () => {
    renderWithProviders(<AddressInfo address={mockAddresses} />);
    
    // Open delete modal
    const deleteButton = screen.getByTestId('delete-address-1');
    fireEvent.click(deleteButton);
    
    // Confirm deletion
    const confirmButton = screen.getByTestId('confirm-delete-button');
    fireEvent.click(confirmButton);
    
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  
  it('closes address form modal when close button is clicked', () => {
    renderWithProviders(<AddressInfo address={mockAddresses} />);
    
    // Open modal
    const addMoreButton = screen.getByTestId('add-more-button');
    fireEvent.click(addMoreButton);
    
    // Close modal
    const closeButton = screen.getByTestId('close-form-button');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('address-modal-mock')).not.toBeInTheDocument();
  });
  
  it('closes delete modal when cancel button is clicked', () => {
    renderWithProviders(<AddressInfo address={mockAddresses} />);
    
    // Open delete modal
    const deleteButton = screen.getByTestId('delete-address-1');
    fireEvent.click(deleteButton);
    
    // Cancel deletion
    const cancelButton = screen.getByTestId('cancel-delete-button');
    fireEvent.click(cancelButton);
    
    expect(screen.queryByTestId('delete-modal-mock')).not.toBeInTheDocument();
  });
});