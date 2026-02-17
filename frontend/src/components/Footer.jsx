import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-20 footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold">SUMIT KI PATHSHALA</span>
            </div>
            <p className="text-gray-300">
              Empowering students from Class 1 to 12 with quality education.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-accent transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/enquiry" className="text-gray-300 hover:text-accent transition-colors">
                  Enquiry
                </Link>
              </li>
                <li>
                <Link to="/admin/login" className="text-gray-300 hover:text-accent transition-colors">
                  admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Subjects</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Mathematics</li>
              <li>Science</li>
              <li>Physics</li>
              <li>Chemistry</li>
              <li>Biology</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-5 w-5 text-accent" />
                <span>SUMIT KI PATHSHALA</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-5 w-5 text-accent" />
                <span>+91 8882939815</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-5 w-5 text-accent" />
                <span>delhi, India</span>
              </li>
                <li className="flex items-center space-x-2 text-gray-300">
                
                <span><div> <span> <Link to="/admin/login" className="text-white hover:text-accent transition-colors ">
                  admin
                </Link></span></div></span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300 ">
          <div><p>&copy; {new Date().getFullYear()} SUMIT KI PATHSHALA. All rights reserved.</p>
          </div>
          
         
          </div>
           
        
        
      </div>
    </footer>
  );
};

export default Footer;
