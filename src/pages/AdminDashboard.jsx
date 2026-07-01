import { NavLink, Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader.jsx";

function AdminDashboard() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Admin</p>
            <h2 className="text-3xl font-black text-white">Creator Hub</h2>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="/admin/dashboard/content"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            Manage Content
          </NavLink>
          <NavLink
            to="/admin/dashboard/blogs"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            Manage Blogs
          </NavLink>
          <NavLink
            to="/admin/dashboard/videos"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            Manage Videos
          </NavLink>
          <NavLink
            to="/admin/dashboard/services"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            Manage Services
          </NavLink>
        </nav>
      </aside>

      <main className="admin-main">
        <AdminHeader />
        <div className="page-header">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
              Welcome back
            </p>
            <h1 className="page-title">Admin Dashboard</h1>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboard;
