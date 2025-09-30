const express = require('express');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Admin middleware for all routes
router.use(authenticateToken, requireAdmin);

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalBlogs = await Blog.countDocuments({ isPublished: true });
    const totalComments = await Comment.countDocuments({ isActive: true });
    const totalDrafts = await Blog.countDocuments({ isPublished: false });

    // Recent activity
    const recentBlogs = await Blog.find({ isPublished: true })
      .populate('author', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find({ isActive: true })
      .select('username firstName lastName createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Popular categories
    const categoryStats = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Monthly blog creation stats
    const monthlyStats = await Blog.aggregate([
      { 
        $match: { 
          isPublished: true,
          createdAt: { 
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) 
          }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalBlogs,
        totalComments,
        totalDrafts
      },
      recentActivity: {
        blogs: recentBlogs,
        users: recentUsers
      },
      categoryStats,
      monthlyStats
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
});

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const status = req.query.status; // 'active', 'inactive', 'all'

    let filter = {};
    
    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { username: searchRegex },
        { email: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .populate('blogs', 'title isPublished')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// Get all blogs with pagination
router.get('/blogs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const status = req.query.status; // 'published', 'draft', 'all'
    const category = req.query.category;

    let filter = {};
    
    if (status === 'published') {
      filter.isPublished = true;
    } else if (status === 'draft') {
      filter.isPublished = false;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const blogs = await Blog.find(filter)
      .populate('author', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Admin get blogs error:', error);
    res.status(500).json({ message: 'Server error while fetching blogs' });
  }
});

// Toggle user active status
router.patch('/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot deactivate admin user' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        username: user.username,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ message: 'Server error while toggling user status' });
  }
});

// Delete blog (admin only)
router.delete('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete associated comments
    await Comment.deleteMany({ blog: blog._id });

    // Remove blog from user's blogs array
    await User.findByIdAndUpdate(blog.author, {
      $pull: { blogs: blog._id }
    });

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Admin delete blog error:', error);
    res.status(500).json({ message: 'Server error while deleting blog' });
  }
});

// Get all comments with pagination
router.get('/comments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status; // 'active', 'inactive', 'all'

    let filter = {};
    
    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    const comments = await Comment.find(filter)
      .populate('author', 'username firstName lastName')
      .populate('blog', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      comments,
      pagination: {
        currentPage: page,
        totalPages,
        totalComments: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Admin get comments error:', error);
    res.status(500).json({ message: 'Server error while fetching comments' });
  }
});

// Toggle comment active status
router.patch('/comments/:id/toggle-status', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.isActive = !comment.isActive;
    await comment.save();

    res.json({
      message: `Comment ${comment.isActive ? 'activated' : 'deactivated'} successfully`,
      comment: {
        id: comment._id,
        isActive: comment.isActive
      }
    });
  } catch (error) {
    console.error('Toggle comment status error:', error);
    res.status(500).json({ message: 'Server error while toggling comment status' });
  }
});

module.exports = router;