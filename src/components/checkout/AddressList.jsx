import React from 'react'
import { FaEdit, FaStreetView, FaTrash } from 'react-icons/fa';
import { MdLocationCity, MdPinDrop, MdPublic } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux'
import { selectUserCheckoutAddress } from '../../store/actions';

const AddressList = ({ addresses, setSelectedAddress, setOpenAddressModal, setOpenDeleteModal }) => {
  const dispatch = useDispatch();
  const { selectedUserCheckoutAddress } = useSelector((state) => state.auth);

  const onEditButtonHandler = (addresses) => {
    setSelectedAddress(addresses);
    setOpenAddressModal(true);
  };

  const onDeleteButtonHandler = (addresses) => {
    setSelectedAddress(addresses);
    setOpenDeleteModal(true);
  };

  const handleAddressSelection = (addresses) => {
    dispatch(selectUserCheckoutAddress(addresses));
  };

  return (
    <div className='space-y-4' data-testid="address-list-container">
      {addresses.map((address) => (
        <div
          key={address.addressId}
          onClick={() => handleAddressSelection(address)}
          className={`p-4 border rounded-md cursor-pointer relative ${selectedUserCheckoutAddress?.addressId === address.addressId
              ? "bg-green-100"
              : "bg-white"
            }`}
          data-testid={`address-item-${address.addressId}`}
          data-selected={selectedUserCheckoutAddress?.addressId === address.addressId}
        >
          <div className="flex items-start">
            <div className="space-y-1">
              <div className="flex items-center ">
                <FaStreetView size={17} className='mr-2 text-gray-600' />
                <p data-testid={`street-${address.addressId}`}>{address.street}</p>
              </div>

              <div className="flex items-center ">
                <MdLocationCity size={17} className='mr-2 text-gray-600' />
                <p data-testid={`city-${address.addressId}`}>{address.city}</p>
              </div>

              <div className="flex items-center ">
                <MdPinDrop size={17} className='mr-2 text-gray-600' />
                <p data-testid={`postcode-${address.addressId}`}>{address.postcode}</p>
              </div>

              <div className="flex items-center ">
                <MdPublic size={17} className='mr-2 text-gray-600' />
                <p data-testid={`country-${address.addressId}`}>{address.country}</p>
              </div>
            </div>
          </div>


          <div className="flex gap-3 absolute top-4 right-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditButtonHandler(address);
              }}
              data-testid={`edit-button-${address.addressId}`}
            >
              <FaEdit size={18} className="text-teal-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteButtonHandler(address);
              }}
              data-testid={`delete-button-${address.addressId}`}
            >
              <FaTrash size={17} className="text-rose-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AddressList