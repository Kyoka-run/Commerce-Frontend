import React from 'react'
import { formatPriceCalculation } from '../../utils/formatPrice'

const OrderSummary = ({ totalPrice, cart, address, paymentMethod }) => {
  return (
    <div className="container mx-auto px-4 mb-8" data-testid="order-summary-container">
      <div className="flex flex-wrap">
        <div className="w-full lg:w-8/12 pr-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg shadow-sm" data-testid="billing-address-section">
              <h2 className='text-2xl font-semibold mb-2'>Billing Address</h2>
              <p data-testid="address-city">
                <strong>City: </strong>
                {address?.city}
              </p>
              <p data-testid="address-street">
                <strong>Street: </strong>
                {address?.street}
              </p>
              <p data-testid="address-postcode">
                <strong>Postcode: </strong>
                {address?.postcode}
              </p>
              <p data-testid="address-country">
                <strong>Country: </strong>
                {address?.country}
              </p>
            </div>
            <div className='p-4 border rounded-lg shadow-sm' data-testid="payment-method-section">
              <h2 className='text-2xl font-semibold mb-2'>
                Payment Method
              </h2>
              <p data-testid="payment-method-value">
                <strong>Method: </strong>
                {paymentMethod}
              </p>
            </div>

            <div className='pb-4 border rounded-lg shadow-sm mb-6' data-testid="order-items-section">
              <h2 className='text-2xl font-semibold mb-2'>Order Items</h2>
              <div className='space-y-2'>
                {cart?.map((item) => (
                  <div key={item?.productId} className='flex items-center' data-testid={`order-item-${item?.productId}`}>
                    <img src={`${import.meta.env.VITE_BACK_END_URL}/images/${item?.image
                      }`}
                      alt='Product'
                      className='w-12 h-12 rounded'
                      data-testid={`item-image-${item?.productId}`}></img>
                    <div className='text-gray-500'>
                      <p data-testid={`item-name-${item?.productId}`}>{item?.productName}</p>
                      <p data-testid={`item-price-${item?.productId}`}>
                        {item?.quantity} x ${item?.specialPrice} = ${
                          formatPriceCalculation(item?.quantity, item?.specialPrice)
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-4/12 mt-4 lg:mt-0">
          <div className="border rounded-lg shadow-sm p-4 space-y-4" data-testid="order-summary-section">
            <h2 className="text-2xl font-semibold mb-2">Order Summary</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Products</span>
                <span data-testid="products-total">${formatPriceCalculation(totalPrice, 1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (0%)</span>
                <span data-testid="tax-amount">$0.00</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>SubTotal</span>
                <span data-testid="subtotal-amount">${formatPriceCalculation(totalPrice, 1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default OrderSummary