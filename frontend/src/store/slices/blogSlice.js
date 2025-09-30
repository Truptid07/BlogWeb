import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/blogs', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
    }
  }
);

export const fetchBlogBySlug = createAsyncThunk(
  'blogs/fetchBlogBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blogs/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Blog not found');
    }
  }
);

export const createBlog = createAsyncThunk(
  'blogs/createBlog',
  async (blogData, { rejectWithValue }) => {
    try {
      const response = await api.post('/blogs', blogData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create blog');
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ id, blogData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/blogs/${id}`, blogData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update blog');
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/blogs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
    }
  }
);

export const likeBlog = createAsyncThunk(
  'blogs/likeBlog',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/blogs/${id}/like`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like blog');
    }
  }
);

export const fetchUserBlogs = createAsyncThunk(
  'blogs/fetchUserBlogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/blogs/user/my-blogs', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user blogs');
    }
  }
);

const initialState = {
  blogs: [],
  currentBlog: null,
  userBlogs: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    category: 'All',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateBlogInList: (state, action) => {
      const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
      if (index !== -1) {
        state.blogs[index] = action.payload;
      }
    },
    removeBlogFromList: (state, action) => {
      state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch blog by slug
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isCreating = false;
        state.userBlogs.unshift(action.payload.blog);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentBlog = action.payload.blog;
        // Update in userBlogs if it exists
        const index = state.userBlogs.findIndex(blog => blog._id === action.payload.blog._id);
        if (index !== -1) {
          state.userBlogs[index] = action.payload.blog;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Delete blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
        state.userBlogs = state.userBlogs.filter(blog => blog._id !== action.payload);
      })
      // Like blog
      .addCase(likeBlog.fulfilled, (state, action) => {
        const { id, likesCount, isLiked } = action.payload;
        
        // Update in blogs list
        const blogIndex = state.blogs.findIndex(blog => blog._id === id);
        if (blogIndex !== -1) {
          state.blogs[blogIndex].likesCount = likesCount;
          state.blogs[blogIndex].isLiked = isLiked;
        }
        
        // Update current blog
        if (state.currentBlog && state.currentBlog._id === id) {
          state.currentBlog.likesCount = likesCount;
          state.currentBlog.isLiked = isLiked;
        }
      })
      // Fetch user blogs
      .addCase(fetchUserBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userBlogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearCurrentBlog, 
  setFilters, 
  updateBlogInList, 
  removeBlogFromList 
} = blogSlice.actions;

export default blogSlice.reducer;