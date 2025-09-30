import { format, formatDistance, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return '';
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy • HH:mm');
  } catch (error) {
    return '';
  }
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    return '';
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

export const stripHtmlTags = (html) => {
  if (!html) return '';
  
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

export const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getCategoryColor = (category) => {
  const colors = {
    Technology: 'bg-blue-100 text-blue-800',
    Lifestyle: 'bg-green-100 text-green-800',
    Travel: 'bg-purple-100 text-purple-800',
    Food: 'bg-yellow-100 text-yellow-800',
    Health: 'bg-red-100 text-red-800',
    Business: 'bg-gray-100 text-gray-800',
    Education: 'bg-indigo-100 text-indigo-800',
    Entertainment: 'bg-pink-100 text-pink-800',
    Sports: 'bg-orange-100 text-orange-800',
    Other: 'bg-gray-100 text-gray-800',
  };
  
  return colors[category] || colors.Other;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};