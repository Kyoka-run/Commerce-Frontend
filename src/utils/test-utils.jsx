import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { productReducer } from '../store/reducer/ProductReducer';
import { errorReducer } from '../store/reducer/errorReducer';
import { cartReducer } from '../store/reducer/cartReducer';
import { authReducer } from '../store/reducer/authReducer';
import { paymentMethodReducer } from '../store/reducer/PaymentMethodReducer';

export function renderWithProviders(ui, {
  preloadedState = {},
  store = configureStore({
    reducer: {
      products: productReducer,
      errors: errorReducer,
      carts: cartReducer,
      auth: authReducer,
      payment: paymentMethodReducer
    },
    preloadedState
  }),
  ...renderOptions
} = {}) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }
  return { 
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }) 
  };
}