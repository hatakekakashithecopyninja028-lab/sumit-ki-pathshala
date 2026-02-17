import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LogIn, LogOut, User, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import { isAuthenticated, getUser, logout, isAdmin } from '../utils/auth';
import AdminDashboard from '../pages/AdminDashboard';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = getUser();
  const isAuth = isAuthenticated();
  const userIsAdmin = isAdmin();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Enquiry', path: '/enquiry' },
  
  ];

  return (
    <nav className="bg-white border-b border-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <BookOpen className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold text-black">SUMIT KI PATHSHALA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-${link.name.toLowerCase()}`}
                className={`font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-black'
                    : 'text-black hover:text-accent'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {/* <div> <span> <Link to="/admin/login" className="text-black hover:text-accent transition-colors ">
                  admin
                </Link></span></div> */}
            
          
            {isAuth ? (
              <>
            
             
                <Link
                  to="/dashboard"
                  data-testid="nav-dashboard"
                  className="flex items-center space-x-2 text-black hover:text-accent transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  data-testid="logout-button"
                  className="flex items-center space-x-2 text-black hover:text-accent transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
            
         
              <Link
                to="/login"
                data-testid="login-button"
                className="btn-primary"
              >
                <LogIn className="inline-block h-5 w-5 mr-2" />
                Login
              </Link>
             
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
            className="md:hidden text-accent-foreground"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4" data-testid="mobile-menu">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 font-medium ${
                  location.pathname === link.path ? 'text-accent' : 'text-black'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAuth ? (
              <>
             
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-accent font-medium"
                  >
                    Admin Panel
                  </Link>
         
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-black"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block py-2 text-black text-left w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-accent font-medium"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
