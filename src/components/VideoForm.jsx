import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../utils/api';

function VideoForm() {
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [platform, setPlatform] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [featured, setFeatured] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      apiFetch(`/videos/${id}`)
        .then((data) => {
          setTitle(data.title);
          setThumbnail(data.thumbnail);
          setPlatform(data.platform);
          setVideoUrl(data.videoUrl);
          setDescription(data.description);
          setPublishDate(new Date(data.publishDate).toISOString().split('T')[0]);
          setFeatured(data.featured);
        })
        .catch(() => {
          // error is already handled and displayed by apiFetch
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoData = {
      title,
      thumbnail,
      platform,
      videoUrl,
      description,
      publishDate,
      featured,
    };

    const url = id ? `/videos/${id}` : '/videos';
    const method = id ? 'PUT' : 'POST';

    try {
      await apiFetch(url, {
        method,
        body: JSON.stringify(videoData),
      });
      navigate('/admin/dashboard/videos');
    } catch (err) {
      // error is already handled and displayed by apiFetch
    }
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
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
            Thumbnail URL
          </label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="text"
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
            Platform
          </label>
          <input
            id="platform"
            name="platform"
            type="text"
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
            Video URL
          </label>
          <input
            id="videoUrl"
            name="videoUrl"
            type="text"
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">
            Publish Date
          </label>
          <input
            id="publishDate"
            name="publishDate"
            type="date"
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <label htmlFor="featured" className="block ml-2 text-sm text-gray-900">
            Featured
          </label>
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
