import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              CursosOnline
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to="/cursos" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                  Cursos
                </Link>
                {user?.role === 'instructor' && (
                  <Link to="/mis-cursos" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                    Mis Cursos
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}