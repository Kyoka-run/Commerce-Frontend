import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import AddressList from './AddressList';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaEdit: vi.fn(() => <span>Edit Icon</span>),
  FaStreetView: vi.fn(() => <span>Street Icon</span>),
  FaTrash: vi.fn(() => <span>Delete Icon</span>)
}));

vi.mock('react-icons/md', () => ({
  MdLocationCity: vi.fn(() => <span>City Icon</span>),
  MdPinDrop: vi.fn(() => <span>Postcode Icon</span>),
  MdPublic: vi.fn(() => <span>Country Icon</span>)
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
        auth: { selectedUserCheckoutAddress: { addressId: 2 } }
      };
      return selector(state);
    })
  };
});

// Mock actions
vi.mock('../../store/actions', () => ({
  selectUserCheckoutAddress: vi.fn(address => ({ 
    type: 'SELECT_USER_CHECKOUT_ADDRESS', 
    payload: address 
  }))
}));

describe('AddressList Component', () => {
  // Mock props
  const mockAddresses = [
    { addressId: 1, street: 'Street 1', city: 'City 1', postcode: '12345', country: 'Country 1' },
    { addressId: 2, street: 'Street 2', city: 'City 2', postcode: '67890', country: 'Country 2' },
    { addressId: 3, street: 'Street 3', city: 'City 3', postcode: '13579', country: 'Country 3' }
  ];
  
  const mockSetSelectedAddress = vi.fn();
  const mockSetOpenAddressModal = vi.fn();
  const mockSetOpenDeleteModal = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the address list container', () => {
    renderWithProviders(
      <AddressList 
        addresses={mockAddresses}
        setSelectedAddress={mockSetSelectedAddress}
        setOpenAddressModal={mockSetOpenAddressModal}
        setOpenDeleteModal={mockSetOpenDeleteModal}
      />
    );
    
    expect(screen.getByTestId('address-list-container')).toBeInTheDocument();
  });
  
  it('renders all addresses in the list', () => {
    renderWithProviders(
      <AddressList 
        addresses={mockAddresses}
        setSelectedAddress={mockSetSelectedAddress}
        setOpenAddressModal={mockSetOpenAddressModal}
        setOpenDeleteModal={mockSetOpenDeleteModal}
      />
    );
    
    // Check that all addresses are rendered
    expect(screen.getByTestId('address-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('address-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('address-item-3')).toBeInTheDocument();
  });
  
  it('displays address details correctly', () => {
    renderWithProviders(
      <AddressList 
        addresses={mockAddresses}
        setSelectedAddress={mockSetSelectedAddress}
        setOpenAddressModal={mockSetOpenAddressModal}
        setOpenDeleteModal={mockSetOpenDeleteModal}
      />
    );
    
    // Check details of first address
    expect(screen.getByTestId('street-1')).toHaveTextContent('Street 1');
    expect(screen.getByTestId('city-1')).toHaveTextContent('City 1');
    expect(screen.getByTestId('postcode-1')).toHaveTextContent('12345');
    expect(screen.getByTestId('country-1')).toHaveTextContent('Country 1');
  });
  
  it('has edit and delete buttons for each address', () => {
    renderWithProviders(
      <AddressList 
        addresses={mockAddresses}
        setSelectedAddress={mockSetSelectedAddress}
        setOpenAddressModal={mockSetOpenAddressModal}
        setOpenDeleteModal={mockSetOpenDeleteModal}
      />
    );
    
    // Check buttons for all addresses
    expect(screen.getByTestId('edit-button-1')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button-1')).toBeInTheDocument();
    expect(screen.getByTestId('edit-button-2')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button-2')).toBeInTheDocument();
    expect(screen.getByTestId('edit-button-3')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button-3')).toBeInTheDocument();
  });
  
  it('highlights the selected address', () => {
    renderWithProviders(
      <AddressList 
        addresses={mockAddresses}
        setSelectedAddress={mockSetSelectedAddress}
        setOpenAddressModal={mockSetOpenAddressModal}
        setOpenDeleteModal={mockSetOpenDeleteModal}
      />
    );
    
    // Address with ID 2 should be selected (from mocked state)
    expect(screen.getByTestId('address-item-2')).toHaveAttribute('data-selected', 'true');
    expect(screen.getByTestId('address-item-1')).not.toHaveAttribute('data-selected', 'true');
  });
  
  it('calls selectUserCheckoutAddress when an address is clicked', () => {
    renderWithProviders(
      <AddressList 
        addresses={mockAddresses}
        setSelectedAddress={mockSetSelectedAddress}
        setOpenAddressModal={mockSetOpenAddressModal}
        setOpenDeleteModal={mockSetOpenDeleteModal}
      />
    );
    
    // Click on first address
    fireEvent.click(screen.getByTestId('address-item-1'));
    
    // Should dispatch selectUserCheckoutAddress with address 1
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  
  it('calls setSelectedAddress and setOpenAddressModal when edit button is clicked', () => {
    renderWithProviders(
      <AddressList 
        addresses={mockAddresses}
        setSelectedAddress={mockSetSelectedAddress}
        setOpenAddressModal={mockSetOpenAddressModal}
        setOpenDeleteModal={mockSetOpenDeleteModal}
      />
    );
    
    // Click edit button for first address
    fireEvent.click(screen.getByTestId('edit-button-1'));
    
    // Should call the edit handlers with address 1
    expect(mockSetSelectedAddress).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedAddress).toHaveBeenCalledWith(mockAddresses[0]);
    expect(mockSetOpenAddressModal).toHaveBeenCalledTimes(1);
    expect(mockSetOpenAddressModal).toHaveBeenCalledWith(true);
  });
  
  it('calls setSelectedAddress and setOpenDeleteModal when delete button is clicked', () => {
    renderWithProviders(
      <AddressList 
        addresses={mockAddresses}
        setSelectedAddress={mockSetSelectedAddress}
        setOpenAddressModal={mockSetOpenAddressModal}
        setOpenDeleteModal={mockSetOpenDeleteModal}
      />
    );
    
    // Click delete button for first address
    fireEvent.click(screen.getByTestId('delete-button-1'));
    
    // Should call the delete handlers with address 1
    expect(mockSetSelectedAddress).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedAddress).toHaveBeenCalledWith(mockAddresses[0]);
    expect(mockSetOpenDeleteModal).toHaveBeenCalledTimes(1);
    expect(mockSetOpenDeleteModal).toHaveBeenCalledWith(true);
  });
  
  it('stops event propagation when edit or delete buttons are clicked', () => {
    renderWithProviders(
      <AddressList 
        addresses={mockAddresses}
        setSelectedAddress={mockSetSelectedAddress}
        setOpenAddressModal={mockSetOpenAddressModal}
        setOpenDeleteModal={mockSetOpenDeleteModal}
      />
    );
    
    // Click edit button for address 1
    fireEvent.click(screen.getByTestId('edit-button-1'));
    
    // Should not dispatch selectUserCheckoutAddress (event propagation stopped)
    expect(mockDispatch).not.toHaveBeenCalled();
    
    // Click delete button for address 1
    fireEvent.click(screen.getByTestId('delete-button-1'));
    
    // Should still not dispatch selectUserCheckoutAddress
    expect(mockDispatch).not.toHaveBeenCalled();
  });
  
  it('renders empty list gracefully', () => {
    renderWithProviders(
      <AddressList 
        addresses={[]}
        setSelectedAddress={mockSetSelectedAddress}
        setOpenAddressModal={mockSetOpenAddressModal}
        setOpenDeleteModal={mockSetOpenDeleteModal}
      />
    );
    
    // Should render container but no address items
    expect(screen.getByTestId('address-list-container')).toBeInTheDocument();
    expect(screen.queryByTestId(/address-item-/)).not.toBeInTheDocument();
  });
});