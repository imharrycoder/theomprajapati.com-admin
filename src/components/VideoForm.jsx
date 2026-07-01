import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL, authFetch } from '../api.js';

function VideoForm() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const url = API_BASE_URL ? `${API_BASE_URL}/videos/${id}` : `/videos/${id}`;
      authFetch(url)
        .then((response) => response.json())
        .then((data) => {
          setTitle(data.title);
          setCategory(data.category);
          setDuration(data.duration);
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVideo = {
      title,
      category,
      duration,
    };

    const url = API_BASE_URL
      ? `${API_BASE_URL}/videos${id ? `/${id}` : ''}`
      : `/videos${id ? `/${id}` : ''}`;
    const method = id ? 'PUT' : 'POST';

    authFetch(url, {
      method,
      body: JSON.stringify(newVideo),
    }).then(() => {
      navigate('/admin/dashboard/videos');
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">{id ? 'Edit Video' : 'Add New Video'}</h2>
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
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration
          </label>
          <input
            id="duration"
            name="duration"
            type="text"
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {id ? 'Update Video' : 'Save Video'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VideoForm;
