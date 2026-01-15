import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, Star, GraduationCap } from 'lucide-react';
import axiosInstance from '../api/axios';
import CourseCard from '../components/CourseCard';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('/courses');
        setCourses(response.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const teachers = [
    {
      name: 'Dr. Rajesh Kumar',
      subject: 'Mathematics',
      experience: '15+ years',
      image: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?w=400'
    },
    {
      name: 'Prof. Sharma',
      subject: 'Physics',
      experience: '20+ years',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'
    },
    {
      name: 'Dr. Priya Singh',
      subject: 'Chemistry',
      experience: '12+ years',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'
    },
    {
      name: 'Dr. Meera Reddy',
      subject: 'Biology',
      experience: '18+ years',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400'
    }
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      class: 'Class 10',
      text: 'sumit ki pathshala helped me score 95% in my boards. The teachers are amazing!',
      rating: 5
    },
    {
      name: 'Priya Patel',
      class: 'Class 12',
      text: 'Best online learning platform. Got selected in JEE with AIR 2000!',
      rating: 5
    },
    {
      name: 'Amit Kumar',
      class: 'Class 9',
      text: 'The courses are very well structured and easy to understand.',
      rating: 5
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 hero-glow overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 hero-glow"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight">
                Master Your Studies with
                <span className="text-green-500"> Expert Teachers</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 max-w-2xl">
                Comprehensive courses for Class 1-12 covering CBSE, ICSE, and State Boards. Live classes, recorded lectures, and personalized doubt solving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses" data-testid="hero-browse-courses-btn" className="btn-primary inline-block text-center">
                  Browse Courses
                  <ArrowRight className="inline-block ml-2 h-5 w-5" />
                </Link>
                <Link to="/enquiry" data-testid="hero-enquiry-btn" className="btn-secondary text-black inline-block text-center">
                  Enquire Now
                </Link>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-black">10,000+</div>
                  <div className="text-sm text-gray-500">Students</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-black">50+</div>
                  <div className="text-sm text-gray-500">Courses</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-black">95%</div>
                  <div className="text-sm text-gray-500">Success Rate</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://plus.unsplash.com/premium_photo-1661402160894-28c1b3b838ee?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2lybCUyMHN0dWRlbnR8ZW58MHx8MHx8fDA%3D"
                  alt="Student studying"
                  className="rounded-xl shadow-lg w-full h-64 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1618355776464-8666794d2520?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdpcmwlMjBzdHVkZW50fGVufDB8fDB8fHww"
                  alt="Student focused"
                  className="rounded-xl shadow-lg w-full h-64 object-cover mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 review" data-testid="why-choose-us-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black">Why Choose SUMIT KI PATHSHALA?</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              We provide the best learning experience with expert teachers and comprehensive study material.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card text-center" data-testid="feature-expert-teachers">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Expert Teachers</h3>
              <p className="text-gray-500">
                Learn from experienced educators with 10+ years of teaching expertise.
              </p>
            </div>
            <div className="feature-card text-center" data-testid="feature-live-classes">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Live & Recorded Classes</h3>
              <p className="text-gray-500">
                Attend live classes or watch recorded sessions at your convenience.
              </p>
            </div>
            <div className="feature-card text-center" data-testid="feature-doubt-solving">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Doubt Solving</h3>
              <p className="text-gray-500">
                Get your doubts cleared instantly through dedicated doubt sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 courses review" data-testid="popular-courses-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">Popular Courses</h2>
            <p className="text-lg text-gray-500">
              Explore our most popular courses across different classes and subjects.
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
          <div className="text-center">
            <Link to="/courses" data-testid="view-all-courses-btn" className="btn-primary inline-block">
              View All Courses
              <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Teachers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 review" data-testid="our-teachers-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">Meet Our Expert Teachers</h2>
            <p className="text-lg text-gray-500">
              Learn from the best educators in the country.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachers.map((teacher, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-testid={`teacher-card-${index}`}>
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-black mb-1">{teacher.name}</h3>
                  <p className="text-accent font-semibold">{teacher.subject}</p>
                  <p className="text-sm text-gray-500 mt-2">{teacher.experience}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 review" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">What Our Students Say</h2>
            <p className="text-lg text-gray-500">
              Success stories from our amazing students.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm" data-testid={`testimonial-card-${index}`}>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-gray-500 mb-4">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-black">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.class}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white section" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg text-gray-200 mb-8">
            Join thousands of students who are already learning with us. Get started today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses" data-testid="cta-browse-courses-btn" className="bg-accent text-white px-8 py-3 rounded-full font-semibold hover:bg-accent/90 transition-all inline-block">
              Browse Courses
            </Link>
            <Link to="/enquiry" data-testid="cta-contact-btn" className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all inline-block">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
