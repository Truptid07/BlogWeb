import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-2xl">B</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">BlogWeb</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md text-lg leading-relaxed">
              A modern blogging platform where stories come alive. Join our community of passionate writers 
              and readers, and discover the power of shared ideas.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://github.com"
                className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiGithub className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiTwitter className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com"
                className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiLinkedin className="h-6 w-6" />
              </a>
              <a
                href="mailto:contact@blogweb.com"
                className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
              >
                <FiMail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Popular Categories</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/?category=Technology" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:bg-blue-400 transition-colors"></span>
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/?category=Lifestyle" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:bg-purple-400 transition-colors"></span>
                  Lifestyle
                </Link>
              </li>
              <li>
                <Link to="/?category=Travel" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                  Travel
                </Link>
              </li>
              <li>
                <Link to="/?category=Food" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 group-hover:bg-orange-400 transition-colors"></span>
                  Food
                </Link>
              </li>
              <li>
                <Link to="/?category=Health" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:bg-red-400 transition-colors"></span>
                  Health
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gradient-to-r border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-base">
              © {currentYear} <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">BlogWeb</span>. Crafted with ❤️ for writers and readers.
            </p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <Link to="/privacy" className="text-gray-300 hover:text-blue-400 text-sm transition-colors font-medium">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-blue-400 text-sm transition-colors font-medium">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-300 hover:text-blue-400 text-sm transition-colors font-medium">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;