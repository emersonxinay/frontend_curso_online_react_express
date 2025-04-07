import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">
                Plataforma de Cursos
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                to="/courses"
                className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
              >
                Cursos
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
              )}
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white">{user.name}</span>
                  <button
                    onClick={logout}
                    className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="space-x-4">
                  <Link
                    to="/login"
                    className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-lg"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/courses"
                className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Cursos
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {user ? (
                <>
                  <span className="text-white px-4 py-2">{user.name}</span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors text-left"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}