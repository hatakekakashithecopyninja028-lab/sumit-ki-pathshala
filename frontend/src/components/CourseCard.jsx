import { Link } from 'react-router-dom';
import { Clock, User as UserIcon, IndianRupee } from 'lucide-react';

const CourseCard = ({ course }) => {
  const courseId = course._id || course.id;
  
  return (
    <div className="course-card group" data-testid={`course-card-${courseId}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail_url || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
          Class {course.class_level}
        </div>
        <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
          {course.subject}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-black mb-2 group-hover:text-accent transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <UserIcon className="h-4 w-4" />
            <span>{course.teacher_name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-2xl font-bold text-black">
            <IndianRupee className="h-6 w-6" />
            <span>{course.price.toLocaleString('en-IN')}</span>
          </div>
          <Link
            to={`/courses/${courseId}`}
            data-testid={`view-course-${courseId}`}
            className="bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/90 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
