import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import useAdmin from '../hooks/useAdmin';
import { AuthContext } from '../contexts/AuthProvider';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [isAdmin, isAdminLoading] = useAdmin();

  if (loading || isAdminLoading) return <div>Loading...</div>;

  if (user && isAdmin) return children;

  return <Navigate to="/" />;
};

export default AdminRoute;
