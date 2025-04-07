import { useState, useEffect } from 'react';
import axios from 'axios';
import AnalyticsCard from '../components/analytics/AnalyticsCard';
import EnrollmentChart from '../components/analytics/EnrollmentChart';
import RevenueAnalysis from '../components/analytics/RevenueAnalysis';
import StudentEngagement from '../components/analytics/StudentEngagement';

export default function Analytics() {
  // Estados para manejar los datos analíticos y la carga
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [viewMode, setViewMode] = useState('general'); // 'general', 'revenue', 'students'

  // Efecto para cargar los datos analíticos cuando cambia el rango de fechas
  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  // Función para obtener los datos analíticos del servidor
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/analytics?range=${dateRange}&mode=${viewMode}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar los datos analíticos:', error);
      setLoading(false);
    }
  };

  // Componente de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado y controles */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Análisis</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitorea el rendimiento de tu plataforma educativa
          </p>
        </div>
        
        {/* Controles de filtrado */}
        <div className="flex space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mes</option>
            <option value="year">Último Año</option>
          </select>

          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('general')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                viewMode === 'general'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setViewMode('revenue')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'revenue'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Ingresos
            </button>
            <button
              onClick={() => setViewMode('students')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                viewMode === 'students'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Estudiantes
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Students"
          value={analytics.totalStudents}
          icon={{
            background: 'bg-blue-100',
            svg: <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }}
          trend={{ value: analytics.studentGrowth, isPositive: analytics.studentGrowth > 0 }}
        />

        <AnalyticsCard
          title="Total Revenue"
          value={`$${analytics.totalRevenue}`}
          icon={{
            background: 'bg-green-100',
            svg: <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }}
          trend={{ value: analytics.revenueGrowth, isPositive: analytics.revenueGrowth > 0 }}
        />

        <AnalyticsCard
          title="Course Completion Rate"
          value={`${analytics.completionRate}%`}
          icon={{
            background: 'bg-yellow-100',
            svg: <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }}
          trend={{ value: analytics.completionRateGrowth, isPositive: analytics.completionRateGrowth > 0 }}
        />

        <AnalyticsCard
          title="Active Courses"
          value={analytics.activeCourses}
          icon={{
            background: 'bg-purple-100',
            svg: <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <EnrollmentChart data={analytics.enrollmentData} />
        <RevenueAnalysis data={analytics.revenueByCategory} />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Courses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Courses</h3>
          <div className="space-y-4">
            {analytics.topCourses.map(course => (
              <div key={course.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{course.title}</p>
                  <p className="text-sm text-gray-500">{course.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${course.revenue}</p>
                  <p className="text-sm text-green-600">+{course.growth}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Demographics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Student Demographics</h3>
          <div className="space-y-4">
            {analytics.demographics.map(item => (
              <div key={item.category} className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-700">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {analytics.recentActivity.map(activity => (
            <div key={activity.id} className="px-6 py-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${activity.type === 'enrollment' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {activity.type === 'enrollment' ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nuevo componente de engagement estudiantil */}
      {viewMode === 'students' && (
        <div className="mt-8">
          <StudentEngagement data={analytics.studentEngagement} />
        </div>
      )}

      {/* Indicadores de rendimiento del sistema */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Rendimiento del Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Tiempo Promedio de Respuesta</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">
              {analytics.systemMetrics?.avgResponseTime}ms
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Disponibilidad del Sistema</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">
              {analytics.systemMetrics?.uptime}%
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Errores del Sistema</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">
              {analytics.systemMetrics?.errorRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}