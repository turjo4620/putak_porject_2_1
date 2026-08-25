import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  const location = useLocation();
  
  console.log('ProtectedRoute - Token:', token ? 'exists' : 'missing');
  console.log('ProtectedRoute - Current path:', location.pathname);
  
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  
  console.log('Token found, rendering children');
  return children;
}
