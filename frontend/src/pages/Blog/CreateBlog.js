import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { 
  FiSave, 
  FiEye, 
  FiImage, 
  FiTag, 
  FiType,
  FiFileText,
  FiSettings,
  FiEdit3,
  FiArrowLeft,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { createBlog } from '../../store/slices/blogSlice';
import PageTransition from '../../components/UI/PageTransition';

const CATEGORIES = [
  'Technology',
  'Lifestyle', 
  'Travel',
  'Food',
  'Health',
  'Business',
  'Education',
  'Entertainment',
  'Sports',
  'Other'
];

const CreateBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.blogs);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Technology',
    tags: [],
    featuredImage: '',
    isPublished: false
  });
  
  const [newTag, setNewTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'image', 'video', 'blockquote', 'code-block'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: '' }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }
    
    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required for better SEO';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, publish = false) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      const blogData = {
        ...formData,
        isPublished: publish
      };

      const result = await dispatch(createBlog(blogData)).unwrap();
      
      toast.success(publish ? 'Blog published successfully!' : 'Blog saved as draft!');
      navigate(`/blog/${result.blog.slug || result.blog._id}`);
    } catch (error) {
      toast.error(error || 'Failed to create blog');
    }
  };

  const stripHtmlTags = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-slide-down">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 hover-lift"
            >
              <FiArrowLeft className="mr-2" />
              Back
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover-lift"
              >
                <FiEye className="mr-2" />
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>
          
          <div className="text-center animate-slide-up stagger-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-text-reveal">
              Create Your Story
            </h1>
            <p className="text-xl text-gray-600 animate-fade-in stagger-2">
              Share your thoughts with the world
            </p>
          </div>
        </div>

        {!showPreview ? (
          /* Edit Mode */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover-lift animate-fade-in-scale">
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-4 animate-slide-in-left">
                  <FiType className="mr-2 text-blue-600" />
                  Blog Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter an engaging title for your blog..."
                  className={`w-full text-2xl font-bold border-0 focus:ring-0 focus:outline-none placeholder-gray-400 resize-none transition-all duration-300 ${
                    errors.title ? 'text-red-600' : 'text-gray-900'
                  }`}
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 animate-slide-up">{errors.title}</p>
                )}
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover-lift animate-fade-in-scale stagger-1">
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-4 animate-slide-in-left">
                  <FiFileText className="mr-2 text-green-600" />
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Write a compelling excerpt that summarizes your blog..."
                  className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none ${
                    errors.excerpt ? 'border-red-300 focus:ring-red-500' : ''
                  }`}
                />
                {errors.excerpt && (
                  <p className="mt-2 text-sm text-red-600 animate-slide-up">{errors.excerpt}</p>
                )}
              </div>

              {/* Content Editor */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover-lift animate-fade-in-scale stagger-2">
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-4 animate-slide-in-left">
                  <FiEdit3 className="mr-2 text-purple-600" />
                  Blog Content
                </label>
                <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}>
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleContentChange}
                    modules={modules}
                    formats={formats}
                    placeholder="Start writing your amazing story here..."
                    className="min-h-96"
                  />
                </div>
                {errors.content && (
                  <p className="mt-2 text-sm text-red-600 animate-slide-up">{errors.content}</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover-lift animate-fade-in-scale stagger-3">
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4 animate-slide-in-left">
                  <FiSettings className="mr-2 text-indigo-600" />
                  Publish Settings
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Publish immediately</span>
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift animate-pulse-glow"
                  >
                    <FiCheck className="mr-2" />
                    {loading ? 'Publishing...' : 'Publish Blog'}
                  </button>
                  
                  <button
                    onClick={(e) => handleSubmit(e, false)}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift"
                  >
                    <FiSave className="mr-2" />
                    {loading ? 'Saving...' : 'Save as Draft'}
                  </button>
                </div>
              </div>

              {/* Category */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover-lift animate-fade-in-scale stagger-4">
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4 animate-slide-in-left">
                  <FiTag className="mr-2 text-orange-600" />
                  Category
                </h3>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover-lift animate-fade-in-scale stagger-5">
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4 animate-slide-in-left">
                  <FiTag className="mr-2 text-pink-600" />
                  Tags
                </h3>
                
                <div className="flex mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                    className="flex-1 border border-gray-300 rounded-l-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 transition-all duration-300 hover-lift"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 animate-bounce-in hover-scale-105"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-red-600 transition-colors duration-200"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover-lift animate-fade-in-scale stagger-6">
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4 animate-slide-in-left">
                  <FiImage className="mr-2 text-green-600" />
                  Featured Image
                </h3>
                <input
                  type="url"
                  name="featuredImage"
                  value={formData.featuredImage}
                  onChange={handleInputChange}
                  placeholder="Enter image URL..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                {formData.featuredImage && (
                  <div className="mt-4">
                    <img
                      src={formData.featuredImage}
                      alt="Featured"
                      className="w-full h-32 object-cover rounded-xl animate-fade-in"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-scale">
              <article>
                {formData.featuredImage && (
                  <img
                    src={formData.featuredImage}
                    alt={formData.title}
                    className="w-full h-64 object-cover rounded-xl mb-8 animate-zoom-in"
                  />
                )}
                
                <header className="mb-8 animate-slide-up">
                  <div className="flex items-center mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium animate-bounce-in">
                      {formData.category}
                    </span>
                  </div>
                  
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-text-reveal">
                    {formData.title || 'Your Blog Title'}
                  </h1>
                  
                  {formData.excerpt && (
                    <p className="text-xl text-gray-600 animate-fade-in stagger-1">
                      {formData.excerpt}
                    </p>
                  )}
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 animate-slide-up stagger-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm animate-bounce-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </header>
                
                <div 
                  className="prose prose-lg max-w-none animate-fade-in stagger-3"
                  dangerouslySetInnerHTML={{ 
                    __html: formData.content || '<p>Start writing your content...</p>' 
                  }}
                />
              </article>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default CreateBlog;