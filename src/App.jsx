import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import ManageBlogs from './pages/ManageBlogs.jsx';
import ManageContent from './pages/ManageContent.jsx';
import ManageServices from './pages/ManageServices.jsx';
import ManageVideos from './pages/ManageVideos.jsx';
import ManageUsers from './pages/ManageUsers.jsx';
import Settings from './pages/Settings.jsx';
import ManageLeads from './pages/ManageLeads.jsx';
import ManagePerformance from './pages/ManagePerformance.jsx';
import BlogForm from './components/BlogForm.jsx';
import ServiceForm from './components/ServiceForm.jsx';
import VideoForm from './components/VideoForm.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route path="content" element={<ManageContent />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="blogs/new" element={<BlogForm />} />
            <Route path="blogs/edit/:id" element={<BlogForm />} />
            <Route path="videos" element={<ManageVideos />} />
            <Route path="videos/new" element={<VideoForm />} />
            <Route path="videos/edit/:id" element={<VideoForm />} />
            <Route path="services" element={<ManageServices />} />
            <Route path="services/new" element={<ServiceForm />} />
            <Route path="services/edit/:id" element={<ServiceForm />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="leads" element={<ManageLeads />} />
            <Route path="performance" element={<ManagePerformance />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
