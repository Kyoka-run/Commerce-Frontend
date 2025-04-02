import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../../store/actions';
import Loader from '../shared/Loader';
import ErrorPage from '../shared/ErrorPage';
import { formatPrice } from '../../utils/formatPrice';

const OrderItem = ({ order }) => {
  const orderDate = new Date(order.orderDate).toLocaleDateString();
  
  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm" data-testid={`order-item-${order.orderId}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-slate-800">
          Order #{order.orderId}
        </h3>
        <div className="text-sm text-slate-600">
          {orderDate}
        </div>
      </div>

      <div className="flex justify-between items-center mb-2 text-sm">
        <div className="text-slate-800">
          <span className="font-medium">Status: </span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
            {order.orderStatus}
          </span>
        </div>
        <div className="text-slate-800">
          <span className="font-medium">Payment: </span>
          {order.payment.paymentMethod}
        </div>
      </div>

      <div className="border-t pt-2 mt-2">
        <h4 className="font-medium mb-2">Items:</h4>
        <div className="space-y-2">
          {order.orderItems.map((item) => (
            <div 
              key={item.orderItemId} 
              className="flex justify-between text-sm"
              data-testid={`order-product-${item.orderItemId}`}>
              <div className="flex items-center">
                <span className="font-medium">{item.product.productName}</span>
                <span className="text-slate-600 ml-2">
                  (x{item.quantity})
                </span>
              </div>
              <div>
                {formatPrice(item.orderedProductPrice * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-2 border-t">
        <div className="text-slate-600 text-sm">
          Payment ID: {order.payment.pgPaymentId || 'N/A'}
        </div>
        <div className="font-bold text-lg">
          Total: {formatPrice(order.totalAmount)}
        </div>
      </div>
    </div>
  );
};

const UserOrders = () => {
  const dispatch = useDispatch();
  const { user, orders } = useSelector((state) => state.auth);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  useEffect(() => {
    if (user) {
      dispatch(getUserOrders());
    }
  }, [dispatch, user]);

  return (
    <div className="min-h-[calc(100vh-70px)] py-14 lg:px-14 sm:px-8 px-4" data-testid="orders-container">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center">
            <FaShoppingBag className="mr-4" />
            My Orders
          </h1>
        </div>

        {isLoading ? (
          <Loader text="Loading your orders..." />
        ) : errorMessage ? (
          <ErrorPage message={errorMessage} />
        ) : orders && orders.length > 0 ? (
          <div className="space-y-6" data-testid="orders-list">
            {orders.map((order) => (
              <OrderItem key={order.orderId} order={order} />
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-8 text-center" data-testid="no-orders-message">
            <p className="text-xl text-slate-700 mb-4">You don't have any orders yet</p>
            <Link 
              to="/products" 
              className="px-6 py-2 bg-customBlue text-white rounded-md hover:bg-blue-700 transition duration-300">
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;