import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    priceRange: ''
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`/courses?${params}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Cursos Disponibles</h1>
          <div className="flex gap-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todas las categorías</option>
              <option value="programming">Programación</option>
              <option value="design">Diseño</option>
              <option value="business">Negocios</option>
              <option value="marketing">Marketing</option>
            </select>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los niveles</option>
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={course.thumbnail || 'https://via.placeholder.com/640x360'}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-600 font-bold">${course.price}</span>
                    <div className="flex items-center">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {course.level}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}