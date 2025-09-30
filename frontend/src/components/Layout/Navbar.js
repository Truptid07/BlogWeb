import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiMenu, FiX, FiUser, FiSettings, FiLogOut, FiEdit, FiHelpCircle } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import { debounce } from '../../utils/helpers';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSearch = debounce((query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    }
  }, 300);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 animate-slide-in-left">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 hover:rotate-12 animate-pulse-glow">
                <span className="text-white font-bold text-xl animate-bounce-in">B</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-500 animate-gradient-shift">BlogWeb</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 animate-fade-in-scale stagger-1">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400 animate-pulse group-focus-within:text-blue-500 transition-colors duration-300" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md focus:shadow-lg hover:border-blue-300 focus-glow"
                placeholder="Search for amazing stories..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 animate-slide-in-right stagger-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-blog"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl animate-pulse-glow hover-lift"
                >
                  <FiEdit className="mr-2 h-4 w-4 animate-bounce-in" />
                  Write Story
                </Link>
                
                {/* User Menu */}
                <div className="relative animate-bounce-in stagger-1">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none group hover-lift transition-all duration-300"
                  >
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover animate-pulse-glow hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center animate-pulse-glow hover:scale-110 transition-all duration-300">
                        <FiUser className="w-4 h-4 text-gray-600 animate-bounce-in" />
                      </div>
                    )}
                    <span className="text-sm font-medium group-hover:text-blue-600 transition-colors duration-300">{user?.firstName}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-slide-down hover-lift">
                      <Link
                        to={`/profile/${user?.username}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-300 hover-lift animate-slide-in-right stagger-1"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FiUser className="mr-3 h-4 w-4 animate-bounce-in" />
                        Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-300 hover-lift animate-slide-in-right stagger-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FiSettings className="mr-3 h-4 w-4 animate-bounce-in" />
                        Dashboard
                      </Link>
                      <Link
                        to="/getting-started"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-300 hover-lift animate-slide-in-right stagger-3"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FiHelpCircle className="mr-3 h-4 w-4 animate-bounce-in" />
                        Help & Tips
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FiSettings className="mr-3 h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiLogOut className="mr-3 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/getting-started"
                  className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-green-50 hover-lift animate-slide-in-right"
                >
                  Getting Started
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-blue-50 hover-lift animate-slide-in-right stagger-1"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl animate-pulse-glow hover-lift animate-bounce-in stagger-2"
                >
                  Join BlogWeb
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden animate-slide-in-right">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all duration-300 hover-lift hover-glow"
            >
              {isMenuOpen ? (
                <FiX className="block h-6 w-6 animate-rotate-scale" />
              ) : (
                <FiMenu className="block h-6 w-6 animate-bounce-in" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t animate-fade-in-scale">
            {/* Mobile Search */}
            <div className="px-3 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-blog"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiEdit className="mr-3 h-5 w-5" />
                  Write
                </Link>
                <Link
                  to={`/profile/${user?.username}`}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="mr-3 h-5 w-5" />
                  Profile
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiSettings className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiSettings className="mr-3 h-5 w-5" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  <FiLogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay for user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;