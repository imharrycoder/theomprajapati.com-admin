import { NavLink, Outlet } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <NavLink
            to="/admin/dashboard/content"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            activeClassName="bg-gray-300"
          >
            Manage Content
          </NavLink>
          <NavLink
            to="/admin/dashboard/blogs"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            activeClassName="bg-gray-300"
          >
            Manage Blogs
          </NavLink>
          <NavLink
            to="/admin/dashboard/videos"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            activeClassName="bg-gray-300"
          >
            Manage Videos
          </NavLink>
          <NavLink
            to="/admin/dashboard/services"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            activeClassName="bg-gray-300"
          >
            Manage Services
          </NavLink>
        </nav>
      </div>
      <div className="flex-1 p-10">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
