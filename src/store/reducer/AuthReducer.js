const initialState = {
  user: null,
  address: [],
  orders: [],
  jwt: localStorage.getItem('jwt') || null,
  clientSecret: null,
  selectedUserCheckoutAddress: null,
}

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_USER":
      return { ...state, user: action.payload, jwt: action.jwtToken };
    case "USER_ADDRESS":
      return { ...state, address: action.payload };
    case "GET_USER_ORDERS":
      return { ...state, orders: action.payload };
    case "SELECT_CHECKOUT_ADDRESS":
      return { ...state, selectedUserCheckoutAddress: action.payload };
    case "REMOVE_CHECKOUT_ADDRESS":
      return { ...state, selectedUserCheckoutAddress: null };
    case "CLIENT_SECRET":
      return { ...state, clientSecret: action.payload };
    case "REMOVE_CLIENT_SECRET_ADDRESS":
      return { ...state, clientSecret: null, selectedUserCheckoutAddress: null };
    case "LOG_OUT":
      return {
        user: null,
        address: null,
        orders: [],
        jwt: null,
      };

    default:
      return state;
  }
};