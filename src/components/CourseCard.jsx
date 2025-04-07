import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img 
        src={course.thumbnail || 'https://via.placeholder.com/400x250'} 
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-indigo-600">
            ${course.price}
          </span>
          <Link
            to={`/courses/${course.id}`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Ver Curso
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;