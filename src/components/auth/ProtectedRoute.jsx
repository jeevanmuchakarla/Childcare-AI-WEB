import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg dark:bg-app-bg-dark">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.some(r => r.toLowerCase() === user.role.toLowerCase())) {
    // Redirect to their own dashboard if they have a different role
    return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
