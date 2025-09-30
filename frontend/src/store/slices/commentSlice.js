import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ blogId, ...params }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/comments/blog/${blogId}`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (commentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/comments', commentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/comments/${id}`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

export const likeComment = createAsyncThunk(
  'comments/likeComment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/comments/${id}/like`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like comment');
    }
  }
);

const initialState = {
  comments: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalComments: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isLoading: false,
  isCreating: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
      state.pagination = initialState.pagination;
    },
    addReplyToComment: (state, action) => {
      const { parentCommentId, reply } = action.payload;
      const parentComment = state.comments.find(comment => comment._id === parentCommentId);
      if (parentComment) {
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push(reply);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload.comments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isCreating = false;
        const newComment = action.payload.comment;
        
        if (newComment.parentComment) {
          // It's a reply
          const parentComment = state.comments.find(
            comment => comment._id === newComment.parentComment
          );
          if (parentComment) {
            if (!parentComment.replies) {
              parentComment.replies = [];
            }
            parentComment.replies.push(newComment);
          }
        } else {
          // It's a top-level comment
          state.comments.unshift(newComment);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      // Update comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload.comment;
        const commentIndex = state.comments.findIndex(
          comment => comment._id === updatedComment._id
        );
        
        if (commentIndex !== -1) {
          state.comments[commentIndex] = updatedComment;
        } else {
          // Check if it's a reply
          state.comments.forEach(comment => {
            if (comment.replies) {
              const replyIndex = comment.replies.findIndex(
                reply => reply._id === updatedComment._id
              );
              if (replyIndex !== -1) {
                comment.replies[replyIndex] = updatedComment;
              }
            }
          });
        }
      })
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const commentId = action.payload;
        state.comments = state.comments.filter(comment => comment._id !== commentId);
        
        // Also remove from replies
        state.comments.forEach(comment => {
          if (comment.replies) {
            comment.replies = comment.replies.filter(reply => reply._id !== commentId);
          }
        });
      })
      // Like comment
      .addCase(likeComment.fulfilled, (state, action) => {
        const { id, likesCount, isLiked } = action.payload;
        
        // Find and update comment
        const commentIndex = state.comments.findIndex(comment => comment._id === id);
        if (commentIndex !== -1) {
          state.comments[commentIndex].likesCount = likesCount;
          state.comments[commentIndex].isLiked = isLiked;
        } else {
          // Check if it's a reply
          state.comments.forEach(comment => {
            if (comment.replies) {
              const replyIndex = comment.replies.findIndex(reply => reply._id === id);
              if (replyIndex !== -1) {
                comment.replies[replyIndex].likesCount = likesCount;
                comment.replies[replyIndex].isLiked = isLiked;
              }
            }
          });
        }
      });
  },
});

export const { clearError, clearComments, addReplyToComment } = commentSlice.actions;
export default commentSlice.reducer;