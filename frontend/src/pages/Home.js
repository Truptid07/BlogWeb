import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchBlogs, setFilters, likeBlog } from '../store/slices/blogSlice';
import { formatRelativeTime, stripHtmlTags } from '../utils/helpers';
import { FiHeart, FiEye, FiSearch, FiTrendingUp, FiUser, FiStar, FiArrowRight, FiCalendar, FiEdit } from 'react-icons/fi';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education', 'Entertainment', 'Sports', 'Other'];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  
  const { blogs, pagination, isLoading, filters } = useSelector((state) => state.blogs);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All';
    const page = parseInt(searchParams.get('page')) || 1;
    
    const newFilters = {
      search,
      category,
    };

    dispatch(setFilters(newFilters));
    setCurrentPage(page);
    
    dispatch(fetchBlogs({
      ...newFilters,
      page,
      limit: 12,
    }));
  }, [dispatch, searchParams]);

  const handleCategoryChange = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', page);
    }
    setSearchParams(newParams);
  };

  const handleLike = (blogId) => {
    if (isAuthenticated) {
      dispatch(likeBlog(blogId));
    }
  };

  if (isLoading && blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white animate-gradient-shift overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        {/* Floating background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-300 opacity-20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-300 opacity-15 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent animate-slide-up">
              BlogWeb
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-slide-up stagger-1">
              Where Stories Come Alive & Ideas Take Flight
            </p>
            <p className="text-lg mb-10 text-blue-50 max-w-2xl mx-auto animate-slide-up stagger-2">
              Join our community of passionate writers and readers. Discover amazing stories, 
              share your thoughts, and connect with creators from around the world.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8 animate-fade-in-scale stagger-3">
              <div className="relative hover-glow">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl animate-pulse" />
                <input
                  type="text"
                  placeholder="Search for amazing stories..."
                  className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-full shadow-lg focus:ring-4 focus:ring-white focus:ring-opacity-30 focus:outline-none text-lg transition-all duration-300 hover:shadow-2xl focus:scale-105"
                  value={filters.search || ''}
                  onChange={(e) => {
                    const newParams = new URLSearchParams(searchParams);
                    if (e.target.value) {
                      newParams.set('search', e.target.value);
                    } else {
                      newParams.delete('search');
                    }
                    setSearchParams(newParams);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center animate-bounce-in stagger-1 hover-lift">
              <div className="bg-blue-100 p-3 rounded-full mb-2 hover-scale-110 animate-pulse-glow">
                <FiUser className="text-blue-600 text-2xl" />
              </div>
              <div className="text-2xl font-bold text-gray-900 animate-fade-in-scale">{pagination.totalBlogs || blogs.length}</div>
              <div className="text-gray-600">Stories Published</div>
            </div>
            <div className="flex flex-col items-center animate-bounce-in stagger-2 hover-lift">
              <div className="bg-green-100 p-3 rounded-full mb-2 hover-scale-110 animate-pulse-glow">
                <FiHeart className="text-green-600 text-2xl animate-heartbeat" />
              </div>
              <div className="text-2xl font-bold text-gray-900 animate-fade-in-scale">
                {blogs.reduce((total, blog) => total + (blog.likesCount || 0), 0)}
              </div>
              <div className="text-gray-600">Total Likes</div>
            </div>
            <div className="flex flex-col items-center animate-bounce-in stagger-3 hover-lift">
              <div className="bg-purple-100 p-3 rounded-full mb-2 hover-scale-110 animate-pulse-glow">
                <FiEye className="text-purple-600 text-2xl" />
              </div>
              <div className="text-2xl font-bold text-gray-900 animate-fade-in-scale">
                {blogs.reduce((total, blog) => total + (blog.views || 0), 0)}
              </div>
              <div className="text-gray-600">Total Views</div>
            </div>
            <div className="flex flex-col items-center animate-bounce-in stagger-4 hover-lift">
              <div className="bg-orange-100 p-3 rounded-full mb-2 hover-scale-110 animate-pulse-glow">
                <FiTrendingUp className="text-orange-600 text-2xl animate-rotate-scale" />
              </div>
              <div className="text-2xl font-bold text-gray-900 animate-fade-in-scale">{CATEGORIES.length - 1}</div>
              <div className="text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Blogs */}
        {blogs.length > 0 && (
          <section className="mb-16 animate-slide-up">
            <div className="flex items-center mb-8 animate-slide-in-left">
              <FiStar className="text-yellow-500 text-2xl mr-3 animate-rotate-scale" />
              <h2 className="text-3xl font-bold text-gray-900 animate-text-reveal">Featured Stories</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {blogs.slice(0, 3).map((blog, index) => (
                <div key={blog._id} className={`animate-fade-in-scale stagger-${index + 1}`}>
                  <FeaturedBlogCard blog={blog} isLarge={index === 0} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <div className="mb-12 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-md p-6 hover-lift animate-fade-in-scale">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 animate-slide-in-left">Explore Categories</h2>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((category, index) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover-lift animate-bounce-in stagger-${(index % 6) + 1} ${
                    filters.category === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg animate-pulse-glow'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-blue-300 hover-glow'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* All Blogs Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {filters.search ? `Search Results` : 'Latest Stories'}
            </h2>
            <div className="text-gray-500">
              {filters.search && (
                <p className="text-gray-600 mb-2">
                  for "<span className="font-semibold">{filters.search}</span>"
                </p>
              )}
              {pagination.totalBlogs > 0 ? (
                <span>{pagination.totalBlogs} {pagination.totalBlogs === 1 ? 'story' : 'stories'} found</span>
              ) : (
                <span>{blogs.length} {blogs.length === 1 ? 'story' : 'stories'}</span>
              )}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length === 0 && !isLoading ? (
              <div className="col-span-full text-center py-16 animate-fade-in-scale">
                <div className="max-w-2xl mx-auto">
                  {filters.search || filters.category !== 'All' ? (
                    // Search results empty
                    <>
                      <FiSearch className="text-6xl text-gray-300 mx-auto mb-4 animate-bounce-in" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 animate-slide-up">No stories found</h3>
                      <p className="text-gray-500 mb-6 animate-slide-up stagger-1">
                        Try adjusting your search criteria or explore different categories.
                      </p>
                      <div className="flex justify-center space-x-4 animate-slide-up stagger-2">
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, search: '', category: 'All' }))}
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 hover-lift"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </>
                  ) : (
                    // No blogs at all
                    <>
                      <div className="animate-bounce-in">
                        <FiEdit className="text-8xl text-blue-300 mx-auto mb-6" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4 animate-slide-up">
                        Be the First to Share Your Story!
                      </h3>
                      <p className="text-xl text-gray-600 mb-8 animate-slide-up stagger-1">
                        BlogWeb is ready for amazing content. Start writing and inspire others with your unique perspective.
                      </p>
                      
                      {isAuthenticated ? (
                        <div className="space-y-4 animate-slide-up stagger-2">
                          <Link
                            to="/create-blog"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 animate-pulse-glow"
                          >
                            <FiEdit className="mr-3 text-xl" />
                            Write Your First Blog
                          </Link>
                          <p className="text-gray-500 text-sm animate-fade-in stagger-3">
                            Share your thoughts, experiences, and knowledge with the world
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6 animate-slide-up stagger-2">
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                              to="/register"
                              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 animate-pulse-glow"
                            >
                              <FiUser className="mr-3 text-xl" />
                              Join BlogWeb
                            </Link>
                            <Link
                              to="/login"
                              className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-2xl hover:bg-blue-50 transition-all duration-300 hover-lift"
                            >
                              <FiEdit className="mr-3 text-xl" />
                              Sign In to Write
                            </Link>
                          </div>
                          
                          <div className="bg-blue-50 rounded-2xl p-6 animate-fade-in stagger-3">
                            <h4 className="font-semibold text-blue-900 mb-3">Why Write on BlogWeb?</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                              <div className="flex items-center animate-bounce-in stagger-4">
                                <FiEdit className="mr-2 flex-shrink-0" />
                                <span>Rich text editor</span>
                              </div>
                              <div className="flex items-center animate-bounce-in stagger-5">
                                <FiHeart className="mr-2 flex-shrink-0" />
                                <span>Engage with readers</span>
                              </div>
                              <div className="flex items-center animate-bounce-in stagger-6">
                                <FiTrendingUp className="mr-2 flex-shrink-0" />
                                <span>Grow your audience</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : blogs.length === 0 && isLoading ? (
              <div className="col-span-full">
                <LoadingSpinner size="large" text="Loading amazing stories..." />
              </div>
            ) : (
              blogs.map((blog, index) => (
                <div key={blog._id} className={`animate-fade-in-scale stagger-${(index % 6) + 1}`}>
                  <BlogCard
                    blog={blog}
                    onLike={handleLike}
                    isAuthenticated={isAuthenticated}
                  />
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center animate-slide-up">
              <nav className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-6 py-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift hover-glow animate-bounce-in"
                >
                  Previous
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover-lift animate-bounce-in stagger-${(page % 6) + 1} ${
                      page === currentPage
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg animate-pulse-glow'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover-glow'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-6 py-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

const FeaturedBlogCard = ({ blog, isLarge }) => {
  const excerpt = blog.excerpt || stripHtmlTags(blog.content).substring(0, isLarge ? 200 : 100) + '...';
  
  return (
    <article className={`${isLarge ? 'lg:col-span-2' : ''} group cursor-pointer animate-fade-in-scale hover-lift`}>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover-glow animate-gradient-shift">
        {blog.featuredImage && (
          <div className="relative overflow-hidden">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                isLarge ? 'h-80' : 'h-48'
              }`}
            />
            <div className="absolute top-4 left-4 animate-slide-in-left">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse-glow hover-scale-110 transition-all duration-300">
                {blog.category}
              </span>
            </div>
            {/* Floating overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        )}
        <div className="p-6 animate-slide-up">
          <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 animate-text-reveal ${
            isLarge ? 'text-2xl' : 'text-xl'
          }`}>
            {blog.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3 animate-fade-in stagger-1">
            {excerpt}
          </p>
          <div className="flex items-center justify-between animate-slide-up stagger-2">
            <div className="flex items-center text-sm text-gray-500 hover-scale-105 transition-transform duration-300">
              <FiUser className="mr-1 animate-pulse" />
              {blog.author?.firstName} {blog.author?.lastName}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center hover-scale-110 transition-transform duration-300">
                <FiHeart className="mr-1 animate-heartbeat" />
                {blog.likesCount || 0}
              </div>
              <div className="flex items-center hover-scale-110 transition-transform duration-300">
                <FiEye className="mr-1 animate-pulse" />
                {blog.views || 0}
              </div>
            </div>
          </div>
          <Link
            to={`/blog/${blog.slug || blog._id}`}
            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800 font-semibold hover-glow transition-all duration-300 animate-bounce-in stagger-3"
          >
            Read More <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </article>
  );
};

const BlogCard = ({ blog, onLike, isAuthenticated }) => {
  const excerpt = blog.excerpt || stripHtmlTags(blog.content).substring(0, 150) + '...';
  
  return (
    <article className="group animate-fade-in-scale hover-lift">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover-glow animate-gradient-shift">
        {blog.featuredImage && (
          <div className="relative overflow-hidden">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 animate-slide-in-left">
              <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium hover-scale-110 transition-all duration-300 animate-bounce-in">
                {blog.category}
              </span>
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        )}
        
        <div className="p-6 animate-slide-up">
          <div className="flex items-center text-sm text-gray-500 mb-3 animate-slide-in-left hover-scale-105 transition-transform duration-300">
            <FiCalendar className="mr-2 animate-pulse" />
            {formatRelativeTime(blog.createdAt)}
          </div>
          
          <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 animate-text-reveal">
            <Link 
              to={`/blog/${blog.slug || blog._id}`}
              className="hover:text-blue-600 transition-colors duration-300 hover-glow"
            >
              {blog.title}
            </Link>
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3 animate-fade-in stagger-1">
            {excerpt}
          </p>
          
          <div className="flex items-center justify-between animate-slide-up stagger-2">
            <div className="flex items-center hover-lift transition-transform duration-300">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 animate-pulse-glow hover-scale-110 transition-all duration-300">
                {blog.author?.firstName?.[0]}{blog.author?.lastName?.[0]}
              </div>
              <div>
                <Link to={`/profile/${blog.author?.username}`}>
                  <p className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-300 hover-glow">
                    {blog.author?.firstName} {blog.author?.lastName}
                  </p>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <button
                onClick={() => onLike(blog._id)}
                disabled={!isAuthenticated}
                className={`flex items-center transition-all duration-300 hover-scale-110 ${
                  blog.isLiked && isAuthenticated
                    ? 'text-red-500 animate-heartbeat'
                    : 'hover:text-red-500'
                } ${!isAuthenticated ? 'cursor-default' : 'cursor-pointer hover-lift'}`}
              >
                <FiHeart className={`mr-1 w-4 h-4 ${blog.isLiked && isAuthenticated ? 'fill-current animate-heartbeat' : ''}`} />
                {blog.likesCount || 0}
              </button>
              <div className="flex items-center hover-scale-110 transition-transform duration-300">
                <FiEye className="mr-1 w-4 h-4 animate-pulse" />
                {blog.views || 0}
              </div>
            </div>
          </div>
          
          <Link
            to={`/blog/${blog.slug || blog._id}`}
            className="inline-flex items-center mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium w-full justify-center hover-lift hover-glow animate-bounce-in stagger-3"
          >
            Read Full Story <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Home;