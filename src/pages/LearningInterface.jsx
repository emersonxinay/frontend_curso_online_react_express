import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function LearningInterface() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseAndProgress();
  }, [courseId]);

  const fetchCourseAndProgress = async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        axios.get(`/courses/${courseId}/content`),
        axios.get(`/courses/${courseId}/progress`)
      ]);
      
      setCourse(courseRes.data);
      setProgress(progressRes.data);
      
      if (!currentModule && courseRes.data.modules.length > 0) {
        setCurrentModule(courseRes.data.modules[0]);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markModuleComplete = async (moduleId) => {
    try {
      await axios.post(`/courses/${courseId}/modules/${moduleId}/complete`);
      const progressRes = await axios.get(`/courses/${courseId}/progress`);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error marking module as complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{course?.title}</h2>
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
                    {progress.overall}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div
                  style={{ width: `${progress.overall}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {course?.modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setCurrentModule(module)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between
                ${currentModule?.id === module.id ? 'bg-indigo-50 text-indigo-600' : ''}
                ${progress.completedModules?.includes(module.id) ? 'text-green-600' : ''}`}
            >
              <span className="flex-1">{module.title}</span>
              {progress.completedModules?.includes(module.id) && (
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {currentModule && (
          <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{currentModule.title}</h1>
            <div className="prose max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: currentModule.content }} />
            </div>
            {!progress.completedModules?.includes(currentModule.id) && (
              <button
                onClick={() => markModuleComplete(currentModule.id)}
                className="btn-primary"
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