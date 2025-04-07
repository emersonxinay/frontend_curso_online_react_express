import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../config/axios';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    try {
      setEnrolling(true);
      await axios.post(`/courses/${id}/enroll`);
      navigate(`/courses/${id}/learn`);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Curso no encontrado</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                  {course.category}
                </span>
                <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full">
                  {course.level}
                </span>
              </div>
              <p className="text-gray-600 mb-8">{course.description}</p>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Lo que aprenderás:</h2>
                <ul className="space-y-2">
                  {course.modules.map((module, index) => (
                    <li key={module.id} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 mr-3">
                        {index + 1}
                      </span>
                      <span>{module.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-8">
              <div className="sticky top-8">
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />
                )}
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-6">
                    ${course.price}
                  </div>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full btn-primary"
                  >
                    {enrolling ? 'Procesando...' : 'Inscribirse al Curso'}
                  </button>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Este curso incluye:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Acceso de por vida</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{course.modules.length} módulos de contenido</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Certificado de finalización</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}