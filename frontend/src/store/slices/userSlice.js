import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'users/fetchUserProfile',
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'User not found');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const followUser = createAsyncThunk(
  'users/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/${userId}/follow`);
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow user');
    }
  }
);

export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/search/users', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search users');
    }
  }
);

export const fetchUserFollowers = createAsyncThunk(
  'users/fetchUserFollowers',
  async ({ userId, ...params }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}/followers`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch followers');
    }
  }
);

export const fetchUserFollowing = createAsyncThunk(
  'users/fetchUserFollowing',
  async ({ userId, ...params }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}/following`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch following');
    }
  }
);

const initialState = {
  currentProfile: null,
  searchResults: [],
  followers: [],
  following: [],
  searchPagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  followersPagination: {
    currentPage: 1,
    totalPages: 1,
    totalFollowers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  followingPagination: {
    currentPage: 1,
    totalPages: 1,
    totalFollowing: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isLoading: false,
  isUpdating: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchPagination = initialState.searchPagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Update current profile if it matches
        if (state.currentProfile && state.currentProfile._id === action.payload.user._id) {
          state.currentProfile = { ...state.currentProfile, ...action.payload.user };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Follow user
      .addCase(followUser.fulfilled, (state, action) => {
        const { userId, isFollowing } = action.payload;
        
        // Update current profile if it matches
        if (state.currentProfile && state.currentProfile._id === userId) {
          state.currentProfile.isFollowing = isFollowing;
          
          // Update followers count
          if (isFollowing) {
            state.currentProfile.followers = state.currentProfile.followers || [];
            state.currentProfile.followers.push({ _id: 'current-user' }); // Placeholder
          } else {
            state.currentProfile.followers = state.currentProfile.followers?.filter(
              follower => follower._id !== 'current-user'
            ) || [];
          }
        }
        
        // Update search results
        const userIndex = state.searchResults.findIndex(user => user._id === userId);
        if (userIndex !== -1) {
          state.searchResults[userIndex].isFollowing = isFollowing;
        }
      })
      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.users;
        state.searchPagination = action.payload.pagination;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch followers
      .addCase(fetchUserFollowers.fulfilled, (state, action) => {
        state.followers = action.payload.followers;
        state.followersPagination = action.payload.pagination;
      })
      // Fetch following
      .addCase(fetchUserFollowing.fulfilled, (state, action) => {
        state.following = action.payload.following;
        state.followingPagination = action.payload.pagination;
      });
  },
});

export const { clearError, clearCurrentProfile, clearSearchResults } = userSlice.actions;
export default userSlice.reducer;