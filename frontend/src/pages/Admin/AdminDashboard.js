import React, { useEffect, useState } from 'react';
import { 
  FiUsers, 
  FiFileText, 
  FiMessageSquare, 
  FiTrendingUp,
  FiEye,
  FiHeart,
  FiCalendar,
  FiSettings,
  FiShield,
  FiActivity
} from 'react-icons/fi';
import api from '../../utils/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatRelativeTime } from '../../utils/helpers';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/admin/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching admin dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <FiShield className="mr-3 text-purple-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, content, and monitor platform activity
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 animate-slide-up stagger-1 hover-lift">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.totalUsers || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 animate-slide-up stagger-2 hover-lift">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FiFileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Published Blogs</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.totalBlogs || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500 animate-slide-up stagger-3 hover-lift">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FiMessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Comments</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.totalComments || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500 animate-slide-up stagger-4 hover-lift">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FiActivity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Draft Posts</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.totalDrafts || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Blogs */}
          <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-up stagger-5">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiFileText className="mr-2 text-green-600" />
              Recent Blogs
            </h2>
            {dashboardData?.recentActivity?.blogs?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentActivity.blogs.map((blog, index) => (
                  <div key={blog._id} className={`border-l-4 border-green-200 pl-4 py-2 animate-slide-in-right stagger-${index + 1}`}>
                    <h3 className="font-semibold text-gray-900">{blog.title}</h3>
                    <p className="text-sm text-gray-600">
                      by {blog.author?.firstName} {blog.author?.lastName}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <FiCalendar className="mr-1 h-3 w-3" />
                        {formatRelativeTime(blog.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <FiEye className="mr-1 h-3 w-3" />
                        {blog.views || 0} views
                      </span>
                      <span className="flex items-center">
                        <FiHeart className="mr-1 h-3 w-3" />
                        {blog.likes?.length || 0} likes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent blog activity</p>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-up stagger-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiUsers className="mr-2 text-blue-600" />
              New Users
            </h2>
            {dashboardData?.recentActivity?.users?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentActivity.users.map((user, index) => (
                  <div key={user._id} className={`border-l-4 border-blue-200 pl-4 py-2 animate-slide-in-right stagger-${index + 1}`}>
                    <h3 className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <FiCalendar className="mr-1 h-3 w-3" />
                      Joined {formatRelativeTime(user.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent user registrations</p>
            )}
          </div>
        </div>

        {/* Category Stats */}
        {dashboardData?.categoryStats && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 animate-slide-up stagger-7">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiTrendingUp className="mr-2 text-purple-600" />
              Popular Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {dashboardData.categoryStats.map((category, index) => (
                <div key={category._id} className={`text-center p-4 bg-gray-50 rounded-lg animate-bounce-in stagger-${index + 1}`}>
                  <h3 className="font-semibold text-gray-900">{category._id}</h3>
                  <p className="text-2xl font-bold text-purple-600">{category.count}</p>
                  <p className="text-xs text-gray-500">posts</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-all duration-300 hover-lift animate-slide-up stagger-8">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-600">View and moderate users</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-all duration-300 hover-lift animate-slide-up stagger-9">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FiFileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Manage Content</h3>
                <p className="text-sm text-gray-600">Review blogs and posts</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-all duration-300 hover-lift animate-slide-up stagger-10">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FiMessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Manage Comments</h3>
                <p className="text-sm text-gray-600">Moderate discussions</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-all duration-300 hover-lift animate-slide-up stagger-11">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FiSettings className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Site Settings</h3>
                <p className="text-sm text-gray-600">Configure platform</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;