import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, User, IndianRupee, BookOpen, CheckCircle, Play, ArrowLeft } from 'lucide-react';
import axiosInstance from '../api/axios';
import { isAuthenticated } from '../utils/auth';
import { toast } from 'sonner';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/enrolled/getallproduct/${courseId}`);
        // Map backend field names to frontend expected field names
        const courseData = response.data;
        const mappedCourse = {
          ...courseData,
          class_level: courseData.class_level,
          teacher_name: courseData.teacher_name,
          thumbnail_url: courseData.thumbnail_url
        };
        setCourse(mappedCourse);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleBuyCourse = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to purchase courses');
      navigate('/login');
      return;
    }

    setPurchasing(true);
    try {
      const orderResponse = await axiosInstance.post('/payments/create-order', {
        course_id: courseId,
        amount: course.price,
      });

      const options = {
        key: orderResponse.data.razorpay_key,
        amount: orderResponse.data.amount * 100,
        currency: orderResponse.data.currency,
        name: 'SUMIT KI PATHSHALA',
        description: course.title,
        order_id: orderResponse.data.order_id,
        handler: async (response) => {
          try {
            await axiosInstance.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              course_id: courseId,
            });
            toast.success('Payment successful! Course enrolled.');
            navigate('/dashboard');
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#10b981',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to initiate payment');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-gray-500 mb-4">Course not found</p>
        <button onClick={() => navigate('/courses')} className="btn-primary">
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/courses')}
          data-testid="back-to-courses-btn"
          className="flex items-center space-x-2 text-black hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Courses</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Course Image/Video */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm" data-testid="course-media">
              <div className="relative h-96">
                <img
                  src={course.thumbnail_url || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800'}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                {course.video_url && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Course Details */}
            <div className="bg-white rounded-xl p-8 shadow-sm" data-testid="course-details">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-accent/10 text-accent px-4 py-1 rounded-full text-sm font-semibold">
                  Class {course.class_level}
                </span>
                <span className="bg-secondary/10 text-secondary px-4 py-1 rounded-full text-sm font-semibold">
                  {course.subject}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">{course.title}</h1>
              <p className="text-lg text-gray-500 mb-6">{course.description}</p>

              <div className="flex items-center  space-x-8 pb-6 border-b border-black">
                <div className="flex items-center text-gray-500 space-x-2 text-gary-500">
                  <User className="h-5 w-5" />
                  <span>{course.teacher_name}</span>
                </div>
                <div className="flex items-center text-gray-500 space-x-2 text-gary-500">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* Syllabus */}
              <div className="pt-6">
                <h2 className="text-2xl font-bold text-black mb-4 flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-accent" />
                  <span>Course Syllabus</span>
                </h2>
                <ul className="space-y-3">
                  {course.syllabus.map((topic, index) => (
                    <li key={index} className="flex items-start space-x-3" data-testid={`syllabus-item-${index}`}>
                      <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                      <span className="text-gray-500">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <div className="pt-6 mt-6 border-t border-black">
                <h2 className="text-2xl font-bold text-black mb-4">Course Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2" data-testid={`feature-item-${index}`}>
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span className="text-gray-500">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-20" data-testid="purchase-card">
              <div className="flex items-center space-x-2 mb-6">
                <IndianRupee className="h-8 w-8 text-black" />
                <span className="text-4xl font-bold text-black">{course.price.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={handleBuyCourse}
                disabled={purchasing}
                data-testid="buy-course-btn"
                className="w-full btn-primary mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {purchasing ? 'Processing...' : 'Buy Now'}
              </button>

              <div className="space-y-3 pt-4 border-t border-black">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-semibold text-black">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Instructor</span>
                  <span className="font-semibold text-black">{course.teacher_name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Class</span>
                  <span className="font-semibold text-black">Class {course.class_level}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subject</span>
                  <span className="font-semibold text-black">{course.subject}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                <p className="text-sm text-center text-black">
                  <CheckCircle className="inline-block h-4 w-4 mr-1 text-accent" />
                  100% Secure Payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
