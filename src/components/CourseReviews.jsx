import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../config/axios';

export default function CourseReviews({ courseId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/courses/${courseId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/courses/${courseId}/reviews`, newReview);
      setReviews([...reviews, response.data]);
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Reseñas del Curso</h2>
      
      {user && (
        <form onSubmit={handleSubmitReview} className="mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Calificación</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {[5, 4, 3, 2, 1].map(num => (
                <option key={num} value={num}>{num} estrellas</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Comentario</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Enviar Reseña
          </button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{review.userName}</h3>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}