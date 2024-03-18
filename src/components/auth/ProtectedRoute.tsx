import { Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if the user is authenticated, if not, redirect to the login page
  let auth = true; // Replace with your authentication logic
  if (!auth) {
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the children using Route component
  return <Route>{children}</Route>;
};

export default ProtectedRoute;
