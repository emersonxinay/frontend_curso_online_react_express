import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentProgress({ courseId, userId }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, [courseId, userId]);

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`/api/courses/${courseId}/progress/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProgress(response.data);
    } catch (err) {
      setError('Error al cargar el progreso');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-pulse">Cargando progreso...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Progreso del Curso</h2>
        <div className="mt-2 flex items-center">
          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progress.overallProgress}%` }}
              />
            </div>
          </div>
          <span className="ml-4 text-sm font-medium text-gray-700">
            {Math.round(progress.overallProgress)}%
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {progress.sections.map((section, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
              <span className="text-sm text-gray-500">
                {section.completedLessons} de {section.totalLessons} lecciones
              </span>
            </div>

            <div className="space-y-3">
              {section.lessons.map((lesson, lIndex) => (
                <div
                  key={lIndex}
                  className={`flex items-center p-2 rounded-lg ${
                    lesson.completed ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {lesson.completed ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                    {lesson.type === 'quiz' && lesson.completed && (
                      <p className="text-xs text-gray-500">
                        Calificación: {lesson.score}%
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    {lesson.lastAccessed && (
                      <span className="text-xs text-gray-500">
                        Último acceso: {new Date(lesson.lastAccessed).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {progress.certificates?.length > 0 && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Certificados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progress.certificates.map((cert, index) => (
              <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{cert.title}</p>
                  <p className="text-sm text-gray-500">
                    Emitido el {new Date(cert.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => window.open(cert.downloadUrl, '_blank')}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}