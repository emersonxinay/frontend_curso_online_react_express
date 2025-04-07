import { Line } from 'react-chartjs-2';

export default function StudentEngagement({ data }) {
  // Configuración del gráfico de engagement
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Engagement Estudiantil por Día'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutos de Actividad'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Fecha'
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Análisis de Engagement Estudiantil
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Monitorea la participación activa de los estudiantes en la plataforma
        </p>
      </div>

      {/* Gráfico de engagement */}
      <div className="h-80">
        <Line data={data} options={options} />
      </div>

      {/* Métricas de engagement */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Tiempo Promedio por Sesión</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">
            {data.averageSessionTime} min
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Tasa de Finalización</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">
            {data.completionRate}%
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Participación en Foros</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">
            {data.forumParticipation} posts/usuario
          </p>
        </div>
      </div>
    </div>
  );
}