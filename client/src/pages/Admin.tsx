import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import AdminPanel from '@/components/admin/AdminPanel';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle } from 'lucide-react';

const Admin = () => {
  const { isAuthenticated, logout } = useAuth();
  const [_, navigate] = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400" />
          <h2 className="mt-2 text-lg font-medium text-neutral-900">
            Authentication Required
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            You need to be logged in to access the admin panel.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-4 py-2"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-primary-500 mr-3" />
            <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <AdminPanel />
      </div>
    </div>
  );
};

export default Admin;
