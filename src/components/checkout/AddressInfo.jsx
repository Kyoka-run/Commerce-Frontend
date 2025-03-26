import React, { useState } from 'react'
import Skeleton from '../shared/Skeleton';
import { FaAddressBook } from 'react-icons/fa';
import AddressInfoModal from './AddressInfoModal';
import AddAddressForm from './AddAddressForm';
import { useDispatch, useSelector } from 'react-redux';
import AddressList from './AddressList';
import { DeleteModal } from './DeleteModal';
import toast from 'react-hot-toast';
import { deleteUserAddress } from '../../store/actions';

const AddressInfo = ({ address }) => {
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const addNewAddressHandler = () => {
    setSelectedAddress("");
    setOpenAddressModal(true);
  };

  const dispatch = useDispatch();

  const deleteAddressHandler = () => {
    dispatch(deleteUserAddress(
      toast,
      selectedAddress?.addressId,
      setOpenDeleteModal
    ))
  };

  const noAddressExist = !address || address.length === 0;
  const { isLoading, btnLoader } = useSelector((state) => state.errors);
  return (
    <div className='pt-4' data-testid="address-info-container">
      {noAddressExist ? (
        <div className='p-6 rounded-lg max-w-md mx-auto flex flex-col items-center justify-center' data-testid="no-address-view">
          <FaAddressBook size={50} className='text-gray-500 mb-4' />
          <h1 className='mb-2 text-slate-900 text-center font-semibold text-2xl' data-testid="no-address-title">
            No Address Added Yet
          </h1>
          <p className='mb-6 text-slate-800 text-center'>
            Please add your address to complete purchase
          </p>

          <button
            onClick={addNewAddressHandler}
            className='px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-all'
            data-testid="add-address-button">
            Add Address
          </button>
        </div>
      ) : (
        <div className='relative p-6 rounded-lg max-w-md mx-auto' data-testid="address-list-view">
          <h1 className='text-slate-800 text-center font-bold text-2xl' data-testid="address-list-title">
            Select Address
          </h1>

          {isLoading ? (
            <div className='py-4 px-8' data-testid="address-loading">
              <Skeleton />
            </div>
          ) : (
            <>
              <div className='space-y-4 pt-6' data-testid="address-list-container">
                <AddressList
                  addresses={address}
                  setSelectedAddress={setSelectedAddress}
                  setOpenAddressModal={setOpenAddressModal}
                  setOpenDeleteModal={setOpenDeleteModal}
                />
              </div>

              {address.length > 0 && (
                <div className='mt-4'>
                  <button
                    onClick={addNewAddressHandler}
                    className='px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-all'
                    data-testid="add-more-button">
                    Add More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}


      <AddressInfoModal
        open={openAddressModal}
        setOpen={setOpenAddressModal}
        data-testid="address-form-modal">
        <AddAddressForm
          address={selectedAddress}
          setOpenAddressModal={setOpenAddressModal} />
      </AddressInfoModal>

      <DeleteModal
        open={openDeleteModal}
        loader={btnLoader}
        setOpen={setOpenDeleteModal}
        title="Delete Address"
        onDeleteHandler={deleteAddressHandler}
        data-testid="delete-address-modal"
      />
    </div>
  )
}

export default AddressInfo