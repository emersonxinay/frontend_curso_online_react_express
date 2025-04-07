import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: null,
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        bio: user.bio || ''
      });
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/enrolled-courses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEnrolledCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.put('http://localhost:5000/api/users/profile', formDataToSend, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setUser(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Perfil */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center">
                <img
                  src={user.avatar || 'https://via.placeholder.com/150'}
                  alt={user.name}
                  className="mx-auto h-32 w-32 rounded-full"
                />
                <h2 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>

              {editMode ? (
                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nombre</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Avatar</label>
                      <input
                        type="file"
                        onChange={(e) => setFormData({...formData, avatar: e.target.files[0]})}
                        className="mt-1 block w-full"
                        accept="image/*"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mt-6">
                  <button
                    onClick={() => setEditMode(true)}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Editar Perfil
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cursos Inscritos */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Mis Cursos</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {enrolledCourses.map(course => (
                  <li key={course.id} className="p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={course.coverImage || 'https://via.placeholder.com/100'}
                        alt={course.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{course.title}</h4>
                        <div className="mt-2">
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block text-indigo-600">
                                  Progreso: {course.progress}%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                              <div
                                style={{ width: `${course.progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <a
                        href={`/curso/${course.id}/contenido`}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                      >
                        Continuar
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}