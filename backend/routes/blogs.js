const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all published blogs with pagination and filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;
    const author = req.query.author;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build filter object
    let filter = { isPublished: true };
    
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    if (author) {
      filter.author = author;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    const blogs = await Blog.find(filter)
      .populate('author', 'username firstName lastName profileImage')
      .populate('comments')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    // Add like status for authenticated users
    const blogsWithLikeStatus = blogs.map(blog => ({
      ...blog,
      likesCount: blog.likes.length,
      commentsCount: blog.comments.length,
      isLiked: req.user ? blog.likes.some(like => like.user.toString() === req.user._id.toString()) : false,
      likes: undefined // Remove likes array from response for privacy
    }));

    const total = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      blogs: blogsWithLikeStatus,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error while fetching blogs' });
  }
});

// Get single blog by slug
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
      .populate('author', 'username firstName lastName profileImage bio')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username firstName lastName profileImage'
        }
      });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    // Prepare response
    const blogResponse = {
      ...blog.toObject(),
      likesCount: blog.likes.length,
      isLiked: req.user ? blog.likes.some(like => like.user.toString() === req.user._id.toString()) : false,
      likes: undefined // Remove likes array from response for privacy
    };

    res.json(blogResponse);
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error while fetching blog' });
  }
});

// Create new blog
router.post('/', authenticateToken, [
  body('title').notEmpty().trim().escape().isLength({ max: 200 }),
  body('content').notEmpty(),
  body('category').isIn(['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education', 'Entertainment', 'Sports', 'Other']),
  body('tags').optional().isArray(),
  body('isPublished').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, tags, featuredImage, isPublished, excerpt } = req.body;

    const blog = new Blog({
      title,
      content,
      category,
      tags: tags || [],
      featuredImage: featuredImage || '',
      isPublished: isPublished || false,
      excerpt,
      author: req.user._id
    });

    await blog.save();

    // Add blog to user's blogs array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { blogs: blog._id }
    });

    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'username firstName lastName profileImage');

    res.status(201).json({
      message: 'Blog created successfully',
      blog: populatedBlog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error while creating blog' });
  }
});

// Update blog
router.put('/:id', authenticateToken, [
  body('title').optional().notEmpty().trim().escape().isLength({ max: 200 }),
  body('content').optional().notEmpty(),
  body('category').optional().isIn(['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education', 'Entertainment', 'Sports', 'Other']),
  body('tags').optional().isArray(),
  body('isPublished').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user owns this blog or is admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    Object.assign(blog, req.body);
    await blog.save();

    const updatedBlog = await Blog.findById(blog._id)
      .populate('author', 'username firstName lastName profileImage');

    res.json({
      message: 'Blog updated successfully',
      blog: updatedBlog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error while updating blog' });
  }
});

// Delete blog
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user owns this blog or is admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
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
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error while deleting blog' });
  }
});

// Like/Unlike blog
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const existingLike = blog.likes.find(
      like => like.user.toString() === req.user._id.toString()
    );

    if (existingLike) {
      // Unlike
      blog.likes = blog.likes.filter(
        like => like.user.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      blog.likes.push({
        user: req.user._id,
        likedAt: new Date()
      });
    }

    await blog.save();

    res.json({
      message: existingLike ? 'Blog unliked' : 'Blog liked',
      likesCount: blog.likes.length,
      isLiked: !existingLike
    });
  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({ message: 'Server error while liking blog' });
  }
});

// Get user's own blogs (drafts and published)
router.get('/user/my-blogs', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status; // 'published', 'draft', or 'all'

    let filter = { author: req.user._id };
    
    if (status === 'published') {
      filter.isPublished = true;
    } else if (status === 'draft') {
      filter.isPublished = false;
    }

    const blogs = await Blog.find(filter)
      .populate('author', 'username firstName lastName profileImage')
      .sort({ updatedAt: -1 })
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
    console.error('Get user blogs error:', error);
    res.status(500).json({ message: 'Server error while fetching user blogs' });
  }
});

module.exports = router;