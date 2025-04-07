import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [courseProgress, setCourseProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/progress', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCourseProgress(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setLoading(false);
    }
  };

  const updateLessonProgress = async (courseId, lessonId, completed) => {
    try {
      await axios.post(
        `http://localhost:5000/api/progress/lesson`,
        { courseId, lessonId, completed },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      fetchUserProgress();
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  };

  return (
    <ProgressContext.Provider value={{
      courseProgress,
      loading,
      updateLessonProgress,
      refreshProgress: fetchUserProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}