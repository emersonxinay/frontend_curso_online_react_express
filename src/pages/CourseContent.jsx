import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../config/axios';

export default function CourseContent() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseContent();
  }, [courseId]);

  const fetchCourseContent = async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        axios.get(`/courses/${courseId}/content`),
        axios.get(`/courses/${courseId}/progress`)
      ]);
      setCourse(courseRes.data);
      setProgress(progressRes.data.progress);
      if (courseRes.data.modules.length > 0) {
        setCurrentModule(courseRes.data.modules[0]);
      }
    } catch (error) {
      console.error('Error fetching course content:', error);
    } finally {
      setLoading(false);
    }
  };

  const markModuleComplete = async (moduleId) => {
    try {
      await axios.post(`/courses/${courseId}/modules/${moduleId}/complete`);
      const progressRes = await axios.get(`/courses/${courseId}/progress`);
      setProgress(progressRes.data.progress);
    } catch (error) {
      console.error('Error marking module as complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900">{course.title}</h2>
          <div className="mt-2">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-indigo-600">
                    Progreso
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-600">
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div
                  style={{ width: `${progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <nav className="mt-4">
          {course.modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setCurrentModule(module)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                currentModule?.id === module.id ? 'bg-indigo-50 text-indigo-600' : ''
              }`}
            >
              <div className="flex items-center">
                <span className="flex-1">{module.title}</span>
                {module.completed && (
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {currentModule && (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{currentModule.title}</h1>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: currentModule.content }} />
            </div>
            {!currentModule.completed && (
              <button
                onClick={() => markModuleComplete(currentModule.id)}
                className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
              >
                Marcar como completado
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}