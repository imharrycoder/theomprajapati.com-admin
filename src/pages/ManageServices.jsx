import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL, authFetch } from '../api.js';

function ManageServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const url = API_BASE_URL ? `${API_BASE_URL}/services` : '/services';
    authFetch(url)
      .then((response) => response.json())
      .then((data) => setServices(data));
  }, []);

  const handleDelete = (id) => {
    const url = API_BASE_URL ? `${API_BASE_URL}/services/${id}` : `/services/${id}`;
    authFetch(url, { method: 'DELETE' }).then(() => {
      setServices((current) => current.filter((service) => service.id !== id));
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Manage Services</h2>
      <div className="mt-6">
        <div className="flex justify-end">
          <Link
            to="/admin/dashboard/services/new"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Service
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{service.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{service.category}</div>
                  </td>
                  <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                    <Link
                      to={`/admin/dashboard/services/edit/${service.id}`}
                      className="px-2 py-1 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(service.id)}
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

export default ManageServices;
