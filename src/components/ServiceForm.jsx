import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL, authFetch } from '../api.js';

function ServiceForm() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const url = API_BASE_URL ? `${API_BASE_URL}/services/${id}` : `/services/${id}`;
      authFetch(url)
        .then((response) => response.json())
        .then((data) => {
          setTitle(data.title);
          setCategory(data.category);
          setDescription(data.description);
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newService = {
      title,
      category,
      description,
    };

    const url = API_BASE_URL
      ? `${API_BASE_URL}/services${id ? `/${id}` : ''}`
      : `/services${id ? `/${id}` : ''}`;
    const method = id ? 'PUT' : 'POST';

    authFetch(url, {
      method,
      body: JSON.stringify(newService),
    }).then(() => {
      navigate('/admin/dashboard/services');
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">
        {id ? 'Edit Service' : 'Add New Service'}
      </h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div>
.          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="6"
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {id ? 'Update Service' : 'Save Service'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ServiceForm;
