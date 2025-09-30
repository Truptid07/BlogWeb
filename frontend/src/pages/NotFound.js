import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiHome, FiSearch, FiStar } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="mb-12">
          {/* Animated 404 */}
          <div className="relative">
            <h1 className="text-[12rem] md:text-[16rem] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 leading-none">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-bounce">
                <FiSearch className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Story Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best stories sometimes get lost!
          </p>

          {/* Suggestions */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-md mx-auto">
            <div className="flex items-center mb-4">
              <FiStar className="text-yellow-500 text-xl mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">What you can do:</h3>
            </div>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Check if the URL is spelled correctly
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Browse our latest stories on the home page
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Search for content you're interested in
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-8 py-4 border border-gray-300 shadow-lg text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
          >
            <FiArrowLeft className="mr-3 h-5 w-5" />
            Go Back
          </button>
          
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105 shadow-lg"
          >
            <FiHome className="mr-3 h-5 w-5" />
            Discover Stories
          </Link>
        </div>

        {/* Fun fact */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl">
          <p className="text-sm text-gray-600 italic">
            💡 Fun fact: The HTTP 404 error code was named after room 404 at CERN, 
            where the World Wide Web was born!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;