import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CourseSettings({ courseId }) {
  const [settings, setSettings] = useState({
    isPublished: false,
    enrollmentOpen: true,
    requiresPrerequisites: false,
    prerequisites: [],
    maxStudents: 0,
    certificateEnabled: true,
    minimumScore: 70,
    autoComplete: false,
    discussionEnabled: true,
    peerReviewEnabled: false
  });

  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
    fetchAvailableCourses();
  }, [courseId]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`/api/courses/${courseId}/settings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSettings(response.data);
    } catch (err) {
      setError('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get('/api/courses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAvailableCourses(response.data.filter(course => course.id !== courseId));
    } catch (err) {
      console.error('Error al cargar cursos disponibles:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/courses/${courseId}/settings`, settings, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      setError('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse">Cargando configuración...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración del Curso</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Publicar Curso
            </label>
            <button
              onClick={() => setSettings({...settings, isPublished: !settings.isPublished})}
              className={`${
                settings.isPublished ? 'bg-green-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
            >
              <span
                className={`${
                  settings.isPublished ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Inscripciones Abiertas
            </label>
            <button
              onClick={() => setSettings({...settings, enrollmentOpen: !settings.enrollmentOpen})}
              className={`${
                settings.enrollmentOpen ? 'bg-green-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
            >
              <span
                className={`${
                  settings.enrollmentOpen ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número Máximo de Estudiantes
            </label>
            <input
              type="number"
              min="0"
              value={settings.maxStudents}
              onChange={(e) => setSettings({...settings, maxStudents: parseInt(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Calificación Mínima para Aprobar (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.minimumScore}
              onChange={(e) => setSettings({...settings, minimumScore: parseInt(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Habilitar Certificados
            </label>
            <button
              onClick={() => setSettings({...settings, certificateEnabled: !settings.certificateEnabled})}
              className={`${
                settings.certificateEnabled ? 'bg-green-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
            >
              <span
                className={`${
                  settings.certificateEnabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Habilitar Discusiones
            </label>
            <button
              onClick={() => setSettings({...settings, discussionEnabled: !settings.discussionEnabled})}
              className={`${
                settings.discussionEnabled ? 'bg-green-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
            >
              <span
                className={`${
                  settings.discussionEnabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
              />
            </button>
          </div>

          {settings.requiresPrerequisites && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prerrequisitos
              </label>
              <select
                multiple
                value={settings.prerequisites}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  setSettings({...settings, prerequisites: values});
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {availableCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
}