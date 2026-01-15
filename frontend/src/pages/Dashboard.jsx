import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Mail, Phone } from 'lucide-react';
import axiosInstance from '../api/axios';
import { getUser, isAuthenticated } from '../utils/auth';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        const response = await axiosInstance.get('/courses');
        const allCourses = response.data;
        const enrolled = allCourses.filter(course => 
          user?.enrolled_courses?.includes(course.id)
        );
        setEnrolledCourses(enrolled);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load enrolled courses');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [navigate, user]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8" data-testid="user-profile-card">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">{user.name}</h1>
              <p className="text-muted-foreground">Student Dashboard</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 text-muted-foreground">
              <Mail className="h-5 w-5 text-accent" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <Phone className="h-5 w-5 text-accent" />
              <span>{user.phone}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary mb-6">My Enrolled Courses</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center" data-testid="no-courses-message">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                You haven't enrolled in any courses yet.
              </p>
              <button
                onClick={() => navigate('/courses')}
                data-testid="browse-courses-btn"
                className="btn-primary"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="enrolled-courses-grid">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-testid={`enrolled-course-${course.id}`}>
                  <div className="relative h-48">
                    <img
                      src={course.thumbnail_url || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Enrolled
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="w-full btn-primary"
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
