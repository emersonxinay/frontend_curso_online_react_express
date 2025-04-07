import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-indigo-800">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
            alt="Education"
          />
          <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Aprende con los mejores
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
            Accede a cursos de alta calidad impartidos por expertos en la industria.
            Desarrolla nuevas habilidades y alcanza tus metas profesionales.
          </p>
          <div className="mt-10">
            {!user ? (
              <div className="space-x-4">
                <Link
                  to="/register"
                  className="inline-block bg-white py-3 px-8 rounded-md font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Registrarse
                </Link>
                <Link
                  to="/login"
                  className="inline-block bg-indigo-600 py-3 px-8 rounded-md font-medium text-white hover:bg-indigo-700"
                >
                  Iniciar Sesión
                </Link>
              </div>
            ) : (
              <Link
                to="/courses"
                className="inline-block bg-indigo-600 py-3 px-8 rounded-md font-medium text-white hover:bg-indigo-700"
              >
                Ver Cursos
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Características
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Una mejor manera de aprender
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      {/* Icon */}
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Aprende a tu ritmo
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Accede al contenido cuando quieras y desde donde quieras.
                    </p>
                  </div>
                </div>
              </div>

              {/* Add more features... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;