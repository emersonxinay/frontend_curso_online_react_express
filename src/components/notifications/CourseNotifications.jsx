import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CourseNotifications({ courseId }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    recipients: 'all'
  });

  useEffect(() => {
    fetchNotifications();
  }, [courseId]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/courses/${courseId}/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(response.data);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/courses/${courseId}/notifications`, newNotification, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        recipients: 'all'
      });
      fetchNotifications();
    } catch (err) {
      console.error('Error al enviar notificación:', err);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Notificaciones del Curso</h2>

      <form onSubmit={handleSendNotification} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            value={newNotification.title}
            onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mensaje</label>
          <textarea
            value={newNotification.message}
            onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              value={newNotification.type}
              onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="info">Información</option>
              <option value="warning">Advertencia</option>
              <option value="success">Éxito</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Destinatarios</label>
            <select
              value={newNotification.recipients}
              onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">Todos los estudiantes</option>
              <option value="active">Estudiantes activos</option>
              <option value="inactive">Estudiantes inactivos</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Enviar Notificación
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse">Cargando notificaciones...</div>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                notification.type === 'info'
                  ? 'bg-blue-50 border-blue-200'
                  : notification.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : notification.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              } border`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">{notification.title}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{notification.message}</p>
              <div className="mt-2 text-sm text-gray-500">
                Enviado a: {notification.recipients}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}