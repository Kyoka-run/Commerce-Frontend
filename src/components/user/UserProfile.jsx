import React from 'react';
import { useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-70px)]">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Please login to view your profile</p>
          <Link 
            to="/login" 
            className="px-6 py-2 bg-customBlue text-white rounded-md hover:bg-blue-700 transition duration-300">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-70px)] py-14 lg:px-14 sm:px-8 px-4" data-testid="profile-container">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center">
            <FaUser className="mr-4" />
            My Profile
          </h1>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">Account Information</h2>
              
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row">
                  <span className="font-semibold w-32 text-slate-700">Username:</span>
                  <span className="text-slate-800" data-testid="profile-username">{user.username}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row">
                  <span className="font-semibold w-32 text-slate-700">Email:</span>
                  <span className="text-slate-800" data-testid="profile-email">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link 
                to="/profile/orders" 
                className="px-6 py-2 bg-customBlue text-white rounded-md hover:bg-blue-700 transition duration-300"
                data-testid="view-orders-button">
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;