import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../config/axios';

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'programming', // Added default category
    thumbnail: '',
    level: 'beginner',
    modules: [{ title: '', content: '', order: 0 }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  const categories = [
    'programming',
    'design',
    'business',
    'marketing',
    'music'
  ];

  const levels = [
    'beginner',
    'intermediate',
    'advanced'
  ];

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/courses/${id}`);
      setFormData(response.data);
      if (response.data.thumbnail) {
        setPreview(response.data.thumbnail);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Error al cargar el curso');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate required fields
    if (!formData.title || !formData.description || !formData.price) {
      setError('Por favor complete todos los campos requeridos');
      setLoading(false);
      return;
    }

    // Validate modules
    if (!formData.modules.every(module => module.title && module.content)) {
      setError('Todos los módulos deben tener título y contenido');
      setLoading(false);
      return;
    }

    try {
      const courseData = {
        ...formData,
        price: Number(formData.price),
        modules: formData.modules.map((module, index) => ({
          ...module,
          order: index
        }))
      };

      if (id) {
        await axios.put(`/courses/${id}`, courseData);
      } else {
        await axios.post('/courses', courseData);
      }
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al guardar el curso');
    } finally {
      setLoading(false);
    }
  };

  // Add these missing handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('thumbnail', file);
      try {
        const response = await axios.post('/upload/thumbnail', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setFormData(prev => ({ ...prev, thumbnail: response.data.url }));
        setPreview(URL.createObjectURL(file));
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Error al subir la imagen');
      }
    }
  };

  // Add category and level selectors to the form
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 gradient-text">
            {id ? 'Editar Curso' : 'Crear Nuevo Curso'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Curso
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => handleChange(e)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={(e) => handleChange(e)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => handleChange(e)}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen del Curso
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="thumbnail"
                />
                <label
                  htmlFor="thumbnail"
                  className="btn-secondary cursor-pointer"
                >
                  Subir Imagen
                </label>
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold mb-4">Módulos del Curso</h2>
              {formData.modules.map((module, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                    placeholder="Título del módulo"
                    className="w-full px-4 py-2 mb-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <textarea
                    value={module.content}
                    onChange={(e) => handleModuleChange(index, 'content', e.target.value)}
                    placeholder="Contenido del módulo"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddModule}
                className="btn-secondary mt-4"
              >
                Agregar Módulo
              </button>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Guardando...' : 'Guardar Curso'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const handleAddModule = () => {
  setFormData(prev => ({
    ...prev,
    modules: [...prev.modules, { title: '', content: '', order: prev.modules.length }]
  }));
};

const handleModuleChange = (index, field, value) => {
  const newModules = [...formData.modules];
  newModules[index] = { ...newModules[index], [field]: value };
  setFormData(prev => ({ ...prev, modules: newModules }));
};