import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FiEdit3, 
  FiFileText, 
  FiEye, 
  FiHeart, 
  FiUsers, 
  FiPlus, 
  FiSettings,
  FiTrendingUp,
  FiCalendar,
  FiClock
} from 'react-icons/fi';
import api from '../../utils/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatRelativeTime } from '../../utils/helpers';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user's blogs
        const blogsResponse = await api.get('/blogs/user/my-blogs?limit=5');
        setRecentBlogs(blogsResponse.data.blogs);
        
        // Calculate stats from user's blogs
        const allBlogsResponse = await api.get('/blogs/user/my-blogs?status=all&limit=1000');
        const allBlogs = allBlogsResponse.data.blogs;
        
        const publishedBlogs = allBlogs.filter(blog => blog.isPublished);
        const draftBlogs = allBlogs.filter(blog => !blog.isPublished);
        
        const totalViews = publishedBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
        const totalLikes = publishedBlogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);
        
        setStats({
          totalBlogs: allBlogs.length,
          publishedBlogs: publishedBlogs.length,
          draftBlogs: draftBlogs.length,
          totalViews,
          totalLikes
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your content and track your progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 animate-slide-up stagger-1 hover-lift">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FiFileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Blogs</h3>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalBlogs || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 animate-slide-up stagger-2 hover-lift">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FiEdit3 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Published</h3>
                <p className="text-2xl font-bold text-gray-900">{stats?.publishedBlogs || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500 animate-slide-up stagger-3 hover-lift">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FiClock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Drafts</h3>
                <p className="text-2xl font-bold text-gray-900">{stats?.draftBlogs || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500 animate-slide-up stagger-4 hover-lift">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FiEye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalViews || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500 animate-slide-up stagger-5 hover-lift">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <FiHeart className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Likes</h3>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalLikes || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            {/* Recent Blogs */}
            <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-up stagger-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Blogs</h2>
                <Link
                  to="/create-blog"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover-lift"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  New Blog
                </Link>
              </div>

              {recentBlogs.length > 0 ? (
                <div className="space-y-4">
                  {recentBlogs.map((blog, index) => (
                    <div key={blog._id} className={`border rounded-lg p-4 animate-slide-in-right stagger-${index + 1} hover-lift`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {blog.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              blog.isPublished 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {blog.isPublished ? 'Published' : 'Draft'}
                            </span>
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
                        <div className="flex space-x-2">
                          {blog.isPublished && (
                            <Link
                              to={`/blog/${blog.slug}`}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <FiEye className="h-4 w-4" />
                            </Link>
                          )}
                          <Link
                            to={`/edit-blog/${blog._id}`}
                            className="text-green-600 hover:text-green-800 transition-colors"
                          >
                            <FiEdit3 className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs yet</h3>
                  <p className="text-gray-500 mb-4">Start creating your first blog post</p>
                  <Link
                    to="/create-blog"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover-lift"
                  >
                    <FiPlus className="mr-2 h-4 w-4" />
                    Create Your First Blog
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-up stagger-7">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/create-blog"
                  className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300 hover-lift"
                >
                  <FiPlus className="mr-3 h-5 w-5 text-green-600" />
                  Create New Blog
                </Link>
                <Link
                  to={`/profile/${user?.username}`}
                  className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300 hover-lift"
                >
                  <FiUsers className="mr-3 h-5 w-5 text-blue-600" />
                  View Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300 hover-lift"
                >
                  <FiSettings className="mr-3 h-5 w-5 text-purple-600" />
                  Account Settings
                </Link>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-up stagger-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Views per Post</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {stats?.publishedBlogs > 0 
                      ? Math.round(stats.totalViews / stats.publishedBlogs) 
                      : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Engagement Rate</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {stats?.totalViews > 0 
                      ? ((stats.totalLikes / stats.totalViews) * 100).toFixed(1) + '%'
                      : '0%'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Publication Rate</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {stats?.totalBlogs > 0 
                      ? ((stats.publishedBlogs / stats.totalBlogs) * 100).toFixed(0) + '%'
                      : '0%'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;