import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import axiosInstance from '../api/axios';
import CourseCard from '../components/CourseCard';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const subjects = ['Maths', 'Science', 'Physics', 'Chemistry', 'Biology'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('/enrolled/getallproduct');
        // Map backend field names to frontend expected field names
        const mappedCourses = response.data.map(course => ({
          ...course,
          class_level: course.class_level,
          teacher_name: course.teacher_name,
          thumbnail_url: course.thumbnail_url
        }));
        setCourses(mappedCourses);
        setFilteredCourses(mappedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;
    if (selectedClass) {
      filtered = filtered.filter(course => course.class_level === selectedClass);
    }
    if (selectedSubject) {
      filtered = filtered.filter(course => course.subject === selectedSubject);
    }
    setFilteredCourses(filtered);
  }, [selectedClass, selectedSubject, courses]);

  const handleClearFilters = () => {
    setSelectedClass('');
    setSelectedSubject('');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">Explore Our Courses</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Choose from our wide range of courses for Class 1-12 across multiple subjects.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8" data-testid="course-filters">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold text-black">Filter Courses</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                data-testid="class-filter"
                className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                data-testid="subject-filter"
                className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="" className='text-gray-500'>All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                data-testid="clear-filters-btn"
                className="w-full px-4 py-2 border border-black rounded-lg  transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12" data-testid="no-courses-message">
            <p className="text-lg text-gray-500">No courses found matching your filters.</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 text-accent hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="courses-grid">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
