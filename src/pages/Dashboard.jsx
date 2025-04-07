import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrolledRes, createdRes] = await Promise.all([
          axios.get('/courses/enrolled'),
          user?.role === 'instructor' ? axios.get('/courses/created') : Promise.resolve({ data: [] })
        ]);
        
        setEnrolledCourses(enrolledRes.data);
        setCreatedCourses(createdRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Bienvenido, {user?.name}</p>
      </div>

      {user?.role === 'instructor' && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mis Cursos Creados</h2>
            <Link
              to="/course-form"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Crear Nuevo Curso
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {createdCourses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-600 font-bold">${course.price}</span>
                  <Link
                    to={`/course-form/${course.id}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Cursos Inscritos</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Progreso: {course.progress || 0}%
                </div>
                <Link
                  to={`/courses/${course.id}/learn`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Continuar
                </Link>
              </div>
            </div>
          ))}
        </div>
        {enrolledCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No estás inscrito en ningún curso.</p>
            <Link
              to="/courses"
              className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
            >
              Explorar cursos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}