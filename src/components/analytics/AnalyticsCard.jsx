export default function AnalyticsCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${icon.background}`}>
          {icon.svg}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value}%
          </span>
          <span className="text-sm text-gray-500 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
}