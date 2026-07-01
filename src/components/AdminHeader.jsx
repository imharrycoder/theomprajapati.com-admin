import { useNavigate, Link } from 'react-router-dom';

function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <header className="flex items-center justify-between p-6 bg-white shadow-md">
      <Link to="/admin/dashboard">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </Link>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Logout
      </button>
    </header>
  );
}

export default AdminHeader;
