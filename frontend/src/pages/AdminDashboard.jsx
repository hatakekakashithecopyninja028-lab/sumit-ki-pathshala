import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  MessageCircle,
  BarChart3,
  LogOut,
  Trash2,
  Plus,
  Search,
  Shield
} from 'lucide-react';
import axiosInstance from '../api/axios';
import { isAuthenticated, isAdmin, logout, getUser } from '../utils/auth';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnquiries: 0,
    recentEnquiries: []
  });
  const [enquiries, setEnquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: '',
    class_level: '',
    subject: '',
    duration: '',
    teacher_name: '',
    thumbnail_url: ''
  });
  const [editCourseForm, setEditCourseForm] = useState({
    title: '',
    description: '',
    price: '',
    class_level: '',
    subject: '',
    duration: '',
    teacher_name: '',
    thumbnail_url: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    
    // Check admin role
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'admin') {
      toast.error('Access denied. Admin credentials required.');
      navigate('/admin/login');
      return;
    }
    
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [enquiriesRes, usersRes, coursesRes] = await Promise.all([
        axiosInstance.get('/enquiry/all'),
        axiosInstance.get('/auth/users'),
        axiosInstance.get('/enrolled/getallproduct')
      ]);

      const enquiriesData = Array.isArray(enquiriesRes.data) ? enquiriesRes.data : (enquiriesRes.data.enquiries || []);
      const usersData = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data.users || []);
      const coursesData = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data;

      setEnquiries(enquiriesData);
      setUsers(usersData);
      setCourses(coursesData);

      setStats({
        totalUsers: usersData.length,
        totalCourses: coursesData.length,
        totalEnquiries: enquiriesData.length,
        recentEnquiries: enquiriesData.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please check your connection.');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const handleDeleteEnquiry = async (id) => {
    try {
      await axiosInstance.delete(`/enquiry/${id}`);
      setEnquiries(enquiries.filter(e => e._id !== id));
      setStats(prev => ({ ...prev, totalEnquiries: prev.totalEnquiries - 1 }));
      toast.success('Enquiry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete enquiry');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/auth/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteCourse = async (id) => {
    console.log('Deleting course with ID:', id);
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const response = await axiosInstance.delete(`/enrolled/product/${id}`);
      console.log('Delete response:', response.data);
      setCourses(courses.filter(c => c._id !== id));
      setStats(prev => ({ ...prev, totalCourses: prev.totalCourses - 1 }));
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Delete course error:', error.response || error);
      toast.error(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setEditCourseForm({
      title: course.title || '',
      description: course.description || '',
      price: course.price || '',
      class_level: course.class_level || '',
      subject: course.subject || '',
      duration: course.duration || '',
      teacher_name: course.teacher_name || '',
      thumbnail_url: course.thumbnail_url || ''
    });
    setModalType('editCourse');
    setShowModal(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    console.log('Updating course:', editingCourse._id, editCourseForm);
    try {
      const response = await axiosInstance.put(`/enrolled/product/${editingCourse._id}`, editCourseForm);
      console.log('Update course response:', response.data);
      
      // Update courses list
      setCourses(courses.map(c => c._id === editingCourse._id ? response.data : c));
      toast.success('Course updated successfully');
      setShowModal(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Update course error:', error.response || error);
      toast.error(error.response?.data?.message || 'Failed to update course');
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    console.log('Adding course:', newCourse);
    try {
      const response = await axiosInstance.post('/enrolled/addproduct', newCourse);
      console.log('Add course response:', response.data);
      const newCourseData = response.data;
      setCourses([...courses, newCourseData]);
      setStats(prev => ({ ...prev, totalCourses: prev.totalCourses + 1 }));
      toast.success('Course added successfully');
      setShowModal(false);
      setNewCourse({
        title: '',
        description: '',
        price: '',
        class_level: '',
        subject: '',
        duration: '',
        teacher_name: '',
        thumbnail_url: ''
      });
    } catch (error) {
      console.error('Add course error:', error.response || error);
      toast.error(error.response?.data?.message || 'Failed to add course');
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const filteredEnquiries = enquiries.filter(e =>
    e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter(c =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '256px',
        backgroundColor: '#111827',
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #374151' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <Shield style={{ height: '32px', width: '32px', color: '#ef4444', marginRight: '8px' }} />
            Admin Panel
          </h1>
        </div>
        <nav style={{ flex: 1, padding: '16px' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'overview', icon: BarChart3, label: 'Overview' },
              { id: 'enquiries', icon: MessageCircle, label: 'Enquiries' },
              { id: 'users', icon: Users, label: 'Users' },
              { id: 'courses', icon: BookOpen, label: 'Courses' },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    backgroundColor: activeTab === item.id ? '#dc2626' : 'transparent',
                    color: activeTab === item.id ? 'white' : '#9ca3af',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  <item.icon style={{ height: '20px', width: '20px', marginRight: '12px' }} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid #374151' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', padding: '0 16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dc2626',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontWeight: '600' }}>{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
            </div>
            <div style={{ marginLeft: '12px' }}>
              <p style={{ fontWeight: '500' }}>{user?.name || 'Admin'}</p>
              <p style={{ fontSize: '14px', color: '#9ca3af' }}>{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px',
              color: '#9ca3af',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <LogOut style={{ height: '20px', width: '20px', marginRight: '12px' }} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '256px', padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1f2937' }}>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                height: '20px',
                width: '20px',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  width: '200px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
              {[
                { icon: Users, label: 'Total Users', value: stats.totalUsers, color: '#3b82f6' },
                { icon: BookOpen, label: 'Total Courses', value: stats.totalCourses, color: '#22c55e' },
                { icon: MessageCircle, label: 'Total Enquiries', value: stats.totalEnquiries, color: '#eab308' },
              ].map((stat, index) => (
                <div key={index} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: stat.color }}>
                      <stat.icon style={{ height: '32px', width: '32px', color: 'white' }} />
                    </div>
                    <div style={{ marginLeft: '16px' }}>
                      <p style={{ color: '#6b7280' }}>{stat.label}</p>
                      <p style={{ fontSize: '30px', fontWeight: 'bold' }}>{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Recent Enquiries</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Course</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Date</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                          No enquiries yet
                        </td>
                      </tr>
                    ) : (
                      stats.recentEnquiries.map((enquiry) => (
                        <tr key={enquiry._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '12px 16px' }}>{enquiry.name}</td>
                          <td style={{ padding: '12px 16px' }}>{enquiry.email}</td>
                          <td style={{ padding: '12px 16px' }}>{enquiry.course}</td>
                          <td style={{ padding: '12px 16px' }}>
                            {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <button
                              onClick={() => handleDeleteEnquiry(enquiry._id)}
                              style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              <Trash2 style={{ height: '20px', width: '20px' }} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Enquiries Tab */}
        {activeTab === 'enquiries' && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Parent Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Phone</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Class</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Course</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Message</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnquiries.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                        No enquiries found
                      </td>
                    </tr>
                  ) : (
                    filteredEnquiries.map((enquiry) => (
                      <tr key={enquiry._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px 16px' }}>{enquiry.name}</td>
                        <td style={{ padding: '12px 16px' }}>{enquiry.parent_name}</td>
                        <td style={{ padding: '12px 16px' }}>{enquiry.email}</td>
                        <td style={{ padding: '12px 16px' }}>{enquiry.phone}</td>
                        <td style={{ padding: '12px 16px' }}>{enquiry.studentClass}</td>
                        <td style={{ padding: '12px 16px' }}>{enquiry.course}</td>
                        <td style={{ padding: '12px 16px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {enquiry.message}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            onClick={() => handleDeleteEnquiry(enquiry._id)}
                            style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            <Trash2 style={{ height: '20px', width: '20px' }} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Phone</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Role</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Joined Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px 16px' }}>{u.name}</td>
                        <td style={{ padding: '12px 16px' }}>{u.email}</td>
                        <td style={{ padding: '12px 16px' }}>{u.phone}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: u.role === 'admin' ? '#fef2f2' : '#eff6ff',
                            color: u.role === 'admin' ? '#991b1b' : '#1e40af'
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              <Trash2 style={{ height: '20px', width: '20px' }} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <button
                onClick={() => openModal('addCourse')}
                style={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  fontWeight: '600',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Plus style={{ height: '20px', width: '20px', marginRight: '8px' }} />
                Add Course
              </button>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {filteredCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                  <BookOpen style={{ height: '48px', width: '48px', margin: '0 auto 16px', opacity: 0.5 }} />
                  <p>No courses found</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                  {filteredCourses.map((course) => (
                    <div key={course._id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                      <img
                        src={course.thumbnail_url || 'https://via.placeholder.com/300x200'}
                        alt={course.title}
                        style={{ width: '100%', height: '192px', objectFit: 'cover' }}
                      />
                      <div style={{ padding: '16px' }}>
                        <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>{course.title}</h3>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px', lineHeight: '1.4', height: '40px', overflow: 'hidden' }}>
                          {course.description}
                        </p>
                        <p style={{ fontWeight: '600', color: '#16a34a', marginBottom: '8px' }}>
                          {course.price ? `₹${course.price}` : 'Free'}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => handleEditCourse(course)}
                            style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
                            title="Edit course"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                              <path d="m15 5 4 4"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                            title="Delete course"
                          >
                            <Trash2 style={{ height: '20px', width: '20px' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {showModal && modalType === 'addCourse' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Add New Course</h3>
            <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  rows="3"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Price (₹)</label>
                <input
                  type="number"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Class Level</label>
                <input
                  type="number"
                  value={newCourse.class_level || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, class_level: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  required
                  min="1"
                  max="12"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Subject</label>
                <input
                  type="text"
                  value={newCourse.subject || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, subject: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  required
                  placeholder="e.g., Mathematics, Science"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Duration</label>
                <input
                  type="text"
                  value={newCourse.duration || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  placeholder="e.g., 3 months, 6 months"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Teacher Name</label>
                <input
                  type="text"
                  value={newCourse.teacher_name || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, teacher_name: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  placeholder="Teacher name"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Thumbnail URL</label>
                <input
                  type="url"
                  value={newCourse.thumbnail_url}
                  onChange={(e) => setNewCourse({ ...newCourse, thumbnail_url: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNewCourse({
                      title: '',
                      description: '',
                      price: '',
                      class_level: '',
                      subject: '',
                      duration: '',
                      teacher_name: '',
                      thumbnail_url: ''
                    });
                  }}
                  style={{ flex: 1, padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '8px 16px', backgroundColor: '#16a34a', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showModal && modalType === 'editCourse' && editingCourse && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Edit Course</h3>
            <form onSubmit={handleUpdateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  value={editCourseForm.title}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Description</label>
                <textarea
                  value={editCourseForm.description}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  rows="3"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Price (₹)</label>
                <input
                  type="number"
                  value={editCourseForm.price}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, price: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Class Level</label>
                <input
                  type="number"
                  value={editCourseForm.class_level || ''}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, class_level: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  required
                  min="1"
                  max="12"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Subject</label>
                <input
                  type="text"
                  value={editCourseForm.subject || ''}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, subject: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Duration</label>
                <input
                  type="text"
                  value={editCourseForm.duration || ''}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, duration: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Teacher Name</label>
                <input
                  type="text"
                  value={editCourseForm.teacher_name || ''}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, teacher_name: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Thumbnail URL</label>
                <input
                  type="url"
                  value={editCourseForm.thumbnail_url}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, thumbnail_url: e.target.value })}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCourse(null);
                  }}
                  style={{ flex: 1, padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                  Update Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

