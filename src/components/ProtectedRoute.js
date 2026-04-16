import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, riderOnly = false }) => {
  const { isAuthenticated, isAdmin, isRider, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50/30">
        <div className="w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  if (riderOnly && !isRider) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
