import React, { useEffect } from 'react'
import InputField from '../shared/InputField'
import { useForm } from 'react-hook-form';
import { FaAddressCard } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Spinners from '../shared/Spinners';
import toast from 'react-hot-toast';
import { addUpdateUserAddress } from '../../store/actions';

const AddAddressForm = ({ address, setOpenAddressModal }) => {
  const dispatch = useDispatch();
  const { btnLoader } = useSelector((state) => state.errors);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const onSaveAddressHandler = async (data) => {
    dispatch(addUpdateUserAddress(
      data,
      toast,
      address?.addressId,
      setOpenAddressModal
    ));
  };


  useEffect(() => {
    if (address?.addressId) {
      setValue("city", address?.city);
      setValue("street", address?.street);
      setValue("postcode", address?.postcode);
      setValue("country", address?.country);
    }
  }, [address]);

  return (
    <div className="" data-testid="add-address-form-container">
      <form
        onSubmit={handleSubmit(onSaveAddressHandler)}
        className=""
        data-testid="add-address-form">
        <div className="flex justify-center items-center mb-4 font-semibold text-2xl text-slate-800 py-2 px-4">
          <FaAddressCard className="mr-2 text-2xl" />
          <span data-testid="form-title">
            {!address?.addressId ?
              "Add Address" :
              "Update Address"
            }
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <InputField
            label="City"
            required
            id="city"
            type="text"
            message="*City is required"
            placeholder="Enter City"
            register={register}
            errors={errors}
            testId="city-input"
          />

          <InputField
            label="Postcode"
            required
            id="postcode"
            type="text"
            message="*Postcode is required"
            placeholder="Enter Postcode"
            register={register}
            errors={errors}
            testId="postcode-input"
          />
          <InputField
            label="Street"
            required
            id="street"
            type="text"
            message="*Street is required"
            placeholder="Enter Street"
            register={register}
            errors={errors}
            testId="street-input"
          />

          <InputField
            label="Country"
            required
            id="country"
            type="text"
            message="*Country is required"
            placeholder="Enter Country"
            register={register}
            errors={errors}
            testId="country-input"
          />
        </div>

        <button
          disabled={btnLoader}
          className="text-white bg-customBlue px-4 py-2 rounded-md mt-4"
          type="submit"
          data-testid="save-address-button">
          {btnLoader ? (
            <>
              <Spinners /> Loading...
            </>
          ) : (
            <>Save</>
          )}
        </button>
      </form>
    </div>
  )
}

export default AddAddressForm