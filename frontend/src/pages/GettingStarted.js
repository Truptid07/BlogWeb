import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiEdit3, 
  FiUsers, 
  FiEye, 
  FiSettings, 
  FiTag,
  FiImage,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';
import PageTransition from '../components/UI/PageTransition';

const GettingStarted = () => {
  const steps = [
    {
      icon: FiEdit3,
      title: "Create Your First Blog",
      description: "Use our rich text editor to craft amazing stories with formatting, images, and more.",
      action: "Start Writing",
      link: "/create-blog",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FiTag,
      title: "Choose Categories & Tags",
      description: "Organize your content with relevant categories and tags to help readers discover your posts.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: FiUsers,
      title: "Engage with Community",
      description: "Like, comment, and interact with other writers to build your network and grow your audience.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: FiEye,
      title: "Track Your Progress",
      description: "Monitor views, likes, and engagement to understand what resonates with your readers.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const features = [
    {
      icon: FiEdit3,
      title: "Rich Text Editor",
      description: "Format your content with headers, lists, links, images, and more"
    },
    {
      icon: FiImage,
      title: "Featured Images",
      description: "Add eye-catching images to make your blogs stand out"
    },
    {
      icon: FiTag,
      title: "Categories & Tags",
      description: "Organize and categorize your content for better discoverability"
    },
    {
      icon: FiSettings,
      title: "Draft & Publish",
      description: "Save drafts and publish when you're ready to share with the world"
    }
  ];

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 animate-slide-down">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-text-reveal">
            Welcome to BlogWeb
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in stagger-1">
            Your platform for sharing stories, ideas, and connecting with readers worldwide. 
            Here's everything you need to know to get started.
          </p>
        </div>

        {/* Quick Start CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 mb-16 text-white text-center animate-fade-in-scale stagger-2">
          <h2 className="text-3xl font-bold mb-4 animate-bounce-in">
            Ready to Share Your Story?
          </h2>
          <p className="text-lg mb-6 opacity-90 animate-slide-up stagger-1">
            Join thousands of writers who are already sharing their amazing content on BlogWeb
          </p>
          <Link
            to="/create-blog"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 animate-pulse-glow"
          >
            <FiEdit3 className="mr-3 text-xl" />
            Write Your First Blog
            <FiArrowRight className="ml-3 text-xl" />
          </Link>
        </div>

        {/* Getting Started Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 animate-slide-up">
            Getting Started is Easy
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index}
                  className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover-lift animate-fade-in-scale stagger-${index + 1}`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mb-4 animate-bounce-in`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 animate-slide-up">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 animate-fade-in stagger-1">
                    {step.description}
                  </p>
                  
                  {step.action && step.link && (
                    <Link
                      to={step.link}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 animate-slide-in-right stagger-2"
                    >
                      {step.action}
                      <FiArrowRight className="ml-2" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 animate-slide-up">
            Powerful Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className={`bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover-lift animate-fade-in-scale stagger-${index + 1}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-xl animate-bounce-in">
                      <Icon className="text-blue-600 text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 animate-slide-up">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 animate-fade-in stagger-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips for Success */}
        <div className="bg-white rounded-3xl p-8 shadow-xl animate-fade-in-scale">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 animate-slide-up">
            Tips for Successful Blogging
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Write compelling headlines that grab attention",
              "Use high-quality images to enhance your content",
              "Break up long text with headers and bullet points",
              "Engage with your readers through comments",
              "Share your posts on social media",
              "Write consistently to build your audience"
            ].map((tip, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-3 animate-bounce-in stagger-${index + 1}`}
              >
                <FiCheckCircle className="text-green-500 text-xl flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16 animate-slide-up">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Blogging Journey?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of passionate writers and start sharing your unique voice with the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-blog"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 animate-pulse-glow"
            >
              <FiEdit3 className="mr-3 text-xl" />
              Create Your First Blog
            </Link>
            
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300 hover-lift"
            >
              <FiEye className="mr-3 text-xl" />
              Explore Existing Blogs
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default GettingStarted;