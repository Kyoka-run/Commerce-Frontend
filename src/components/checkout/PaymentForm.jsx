import { Skeleton } from '@mui/material';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React from 'react'
import { useState } from 'react';

const PaymentForm = ({ clientSecret, totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${import.meta.env.VITE_FRONT_END_URL}/order-confirm`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      return false;
    }
  };

  const paymentElementOptions = {
    layout: "tabs",
  }

  const isLoading = !clientSecret || !stripe || !elements;

  return (
    <form onSubmit={handleSubmit} className='max-w-lg mx-auto p-4' data-testid="payment-form">
      <h2 className='text-xl font-semibold mb-4'>Payment Information</h2>
      {isLoading ? (
        <div>
          <Skeleton />
        </div>
      ) : (
        <div>
          {clientSecret && <PaymentElement options={paymentElementOptions} data-testid="payment-element" />}
          {errorMessage && (
            <div className='text-red-500 mt-2' data-testid="payment-error-message">{errorMessage}</div>
          )}

          <button
            className='text-white w-full px-5 py-[10px] bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse'
            disabled={!stripe || isLoading}
          >
            {!isLoading ? `Pay $${Number(totalPrice).toFixed(2)}`
              : "Processing"}
          </button>
        </div>
      )}
    </form>
  )
}

export default PaymentForm