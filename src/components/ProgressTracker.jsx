import { useProgress } from '../context/ProgressContext';

export default function ProgressTracker({ courseId }) {
  const { courseProgress, loading } = useProgress();
  const progress = courseProgress[courseId] || { completed: 0, total: 0, lessons: [] };
  const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Course Progress</h3>
        <span className="text-2xl font-bold text-indigo-600">{percentage}%</span>
      </div>

      <div className="relative pt-1">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
          <div
            style={{ width: `${percentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
          ></div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Completed Lessons</h4>
        <div className="space-y-2">
          {progress.lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center">
              {lesson.completed ? (
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className={`ml-2 text-sm ${lesson.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                {lesson.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {percentage === 100 && (
        <div className="mt-6 text-center">
          <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600">
            Course Completed! 🎉
          </span>
        </div>
      )}
    </div>
  );
}