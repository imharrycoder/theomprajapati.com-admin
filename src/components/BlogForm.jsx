import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL, authFetch } from '../api.js';

function BlogForm() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const url = API_BASE_URL ? `${API_BASE_URL}/blogPosts/${id}` : `/blogPosts/${id}`;
      authFetch(url)
        .then((response) => response.json())
        .then((data) => {
          setTitle(data.title);
          setCategory(data.category);
          setExcerpt(data.excerpt);
          setContent(data.content.map((c) => c.body).join('\n\n'));
        });
    }
  }, [id]);

  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const slug = createSlug(title);
    const newPost = {
      title,
      slug,
      category,
      excerpt,
      content: content.split('\n\n').map(paragraph => ({ heading: title, body: paragraph })),
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      author: 'The Om Prajapati',
      premium: false,
      featured: false,
      tags: [category],
    };

    const url = API_BASE_URL
      ? `${API_BASE_URL}/blogPosts${id ? `/${id}` : ''}`
      : `/blogPosts${id ? `/${id}` : ''}`;
    const method = id ? 'PUT' : 'POST';

    authFetch(url, {
      method,
      body: JSON.stringify(newPost),
    }).then(() => {
      navigate('/admin/dashboard/blogs');
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">
        {id ? 'Edit Blog Post' : 'Add New Blog Post'}
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
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows="3"
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows="6"
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {id ? 'Update Post' : 'Save Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BlogForm;
