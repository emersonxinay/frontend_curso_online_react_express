import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('/auth/verify');
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}