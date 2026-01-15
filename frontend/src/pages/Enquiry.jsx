import { useState } from 'react';
import { User, Users, Phone, Mail, BookOpen, MessageSquare } from 'lucide-react';
import axiosInstance from '../api/axios';
import { toast } from 'sonner';

const Enquiry = () => {
  const [formData, setFormData] = useState({
    student_name: '',
    parent_name: '',
    class_level: '',
    phone: '',
    email: '',
    interested_course: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post('/enquiries', formData);
      toast.success('Enquiry submitted successfully! We will contact you soon via WhatsApp.');
      setFormData({
        student_name: '',
        parent_name: '',
        class_level: '',
        phone: '',
        email: '',
        interested_course: '',
        message: '',
      });
    } catch (error) {
      console.error('Enquiry error:', error);
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">Get In Touch</h1>
          <p className="text-lg text-gray-500">
            Fill out the form below and our team will get back to you via WhatsApp within 24 hours.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="enquiry-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="student_name" className="block text-sm font-medium text-black mb-2">
                  Student Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    id="student_name"
                    name="student_name"
                    type="text"
                    required
                    data-testid="enquiry-student-name-input"
                    value={formData.student_name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Student's full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="parent_name" className="block text-sm font-medium text-black mb-2">
                  Parent Name *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    id="parent_name"
                    name="parent_name"
                    type="text"
                    required
                    data-testid="enquiry-parent-name-input"
                    value={formData.parent_name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Parent's full name"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="class_level" className="block text-sm font-medium text-black mb-2">
                  Class *
                </label>
                <select
                  id="class_level"
                  name="class_level"
                  required
                  data-testid="enquiry-class-select"
                  value={formData.class_level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      Class {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    data-testid="enquiry-phone-input"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="phone no."
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  data-testid="enquiry-email-input"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="interested_course" className="block text-sm font-medium text-black mb-2">
                Interested Course *
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  id="interested_course"
                  name="interested_course"
                  type="text"
                  required
                  data-testid="enquiry-course-input"
                  value={formData.interested_course}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g., Mathematics for Class 10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                Message (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  data-testid="enquiry-message-input"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Any additional information or questions..."
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="enquiry-submit-btn"
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Enquiry'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-accent/10 rounded-lg">
            <p className="text-sm text-center text-black">
              📱 Our team will contact you on WhatsApp within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enquiry;
