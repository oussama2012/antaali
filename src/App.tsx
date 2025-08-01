import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import ShopDashboard from './components/shop/ShopDashboard';
import FactoryDashboard from './components/factory/FactoryDashboard';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'shop':
      return <ShopDashboard />;
    case 'factory':
      return <FactoryDashboard />;
    default:
      return <Login />;
  }
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
