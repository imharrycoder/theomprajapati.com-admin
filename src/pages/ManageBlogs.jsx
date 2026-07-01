import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL, authFetch } from '../api.js';

function ManageBlogs() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const url = API_BASE_URL ? `${API_BASE_URL}/blogPosts` : '/blogPosts';
    authFetch(url)
      .then((response) => response.json())
      .then((data) => setBlogPosts(data));
  }, []);

  const handleDelete = (id) => {
    const url = API_BASE_URL ? `${API_BASE_URL}/blogPosts/${id}` : `/blogPosts/${id}`;
    authFetch(url, { method: 'DELETE' }).then(() => {
      setBlogPosts((current) => current.filter((post) => post.id !== id));
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Manage Blogs</h2>
      <div className="mt-6">
        <div className="flex justify-end">
          <Link
            to="/admin/dashboard/blogs/new"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Post
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">
                  Title
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">
                  Category
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{post.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{post.date}</div>
                  </td>
                  <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                    <Link
                      to={`/admin/dashboard/blogs/edit/${post.id}`}
                      className="px-2 py-1 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-2 py-1 text-xs font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageBlogs;
