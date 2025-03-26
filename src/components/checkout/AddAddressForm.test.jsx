import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import AddAddressForm from './AddAddressForm';

// Mock dependencies
vi.mock('../shared/InputField', () => ({
  default: vi.fn(({ label, id, register, errors, testId }) => (
    <div data-testid={`input-field-${id}`}>
      <label>{label}</label>
      <input 
        data-testid={testId}
        {...register(id)}
      />
    </div>
  ))
}));

vi.mock('../shared/Spinners', () => ({
  default: vi.fn(() => <div data-testid="spinner-mock">Loading Spinner</div>)
}));

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaAddressCard: vi.fn(() => <span>Address Icon</span>)
}));

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    register: vi.fn(name => ({ name })),
    handleSubmit: vi.fn(cb => data => cb(data)),
    reset: vi.fn(),
    setValue: vi.fn(),
    formState: { errors: {} }
  }))
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
        errors: { btnLoader: false }
      };
      return selector(state);
    })
  };
});

// Mock actions
vi.mock('../../store/actions', () => ({
  addUpdateUserAddress: vi.fn((data, toast, addressId, setOpenAddressModal) => ({ 
    type: 'ADD_UPDATE_USER_ADDRESS', 
    payload: { data, addressId } 
  }))
}));

describe('AddAddressForm Component', () => {
  // Mock props
  const mockSetOpenAddressModal = vi.fn();
  
  // Mock addresses
  const newAddress = null;
  
  const existingAddress = {
    addressId: 1,
    city: 'Test City',
    street: 'Test Street',
    postcode: '12345',
    country: 'Test Country'
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the address form container', () => {
    renderWithProviders(
      <AddAddressForm 
        address={newAddress} 
        setOpenAddressModal={mockSetOpenAddressModal} 
      />
    );
    
    expect(screen.getByTestId('add-address-form-container')).toBeInTheDocument();
    expect(screen.getByTestId('add-address-form')).toBeInTheDocument();
  });
  
  it('shows "Add Address" title for new address', () => {
    renderWithProviders(
      <AddAddressForm 
        address={newAddress} 
        setOpenAddressModal={mockSetOpenAddressModal} 
      />
    );
    
    expect(screen.getByTestId('form-title')).toHaveTextContent('Add Address');
  });
  
  it('shows "Update Address" title for existing address', () => {
    renderWithProviders(
      <AddAddressForm 
        address={existingAddress} 
        setOpenAddressModal={mockSetOpenAddressModal} 
      />
    );
    
    expect(screen.getByTestId('form-title')).toHaveTextContent('Update Address');
  });
  
  it('renders all input fields', () => {
    renderWithProviders(
      <AddAddressForm 
        address={newAddress} 
        setOpenAddressModal={mockSetOpenAddressModal} 
      />
    );
    
    expect(screen.getByTestId('input-field-city')).toBeInTheDocument();
    expect(screen.getByTestId('input-field-street')).toBeInTheDocument();
    expect(screen.getByTestId('input-field-postcode')).toBeInTheDocument();
    expect(screen.getByTestId('input-field-country')).toBeInTheDocument();
    expect(screen.getByTestId('city-input')).toBeInTheDocument();
    expect(screen.getByTestId('street-input')).toBeInTheDocument();
    expect(screen.getByTestId('postcode-input')).toBeInTheDocument();
    expect(screen.getByTestId('country-input')).toBeInTheDocument();
  });
  
  it('has a save button', () => {
    renderWithProviders(
      <AddAddressForm 
        address={newAddress} 
        setOpenAddressModal={mockSetOpenAddressModal} 
      />
    );
    
    expect(screen.getByTestId('save-address-button')).toBeInTheDocument();
    expect(screen.getByTestId('save-address-button')).toHaveTextContent('Save');
  });
});