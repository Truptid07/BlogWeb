const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create comment
router.post('/', authenticateToken, [
  body('content').notEmpty().trim().isLength({ max: 1000 }),
  body('blogId').isMongoId(),
  body('parentCommentId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, blogId, parentCommentId } = req.body;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog || !blog.isPublished) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if parent comment exists (for replies)
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment || parentComment.blog.toString() !== blogId) {
        return res.status(400).json({ message: 'Invalid parent comment' });
      }
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      blog: blogId,
      parentComment: parentCommentId || null
    });

    await comment.save();

    // Add comment to blog
    await Blog.findByIdAndUpdate(blogId, {
      $push: { comments: comment._id }
    });

    // Add reply to parent comment if it's a reply
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username firstName lastName profileImage');

    res.status(201).json({
      message: 'Comment created successfully',
      comment: populatedComment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error while creating comment' });
  }
});

// Get comments for a blog
router.get('/blog/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get top-level comments (not replies)
    const comments = await Comment.find({ 
      blog: blogId, 
      parentComment: null,
      isActive: true 
    })
      .populate('author', 'username firstName lastName profileImage')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username firstName lastName profileImage'
        },
        match: { isActive: true }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ 
      blog: blogId, 
      parentComment: null,
      isActive: true 
    });

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
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error while fetching comments' });
  }
});

// Update comment
router.put('/:id', authenticateToken, [
  body('content').notEmpty().trim().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns this comment or is admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = req.body.content;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('author', 'username firstName lastName profileImage');

    res.json({
      message: 'Comment updated successfully',
      comment: updatedComment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error while updating comment' });
  }
});

// Delete comment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns this comment or is admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Soft delete (mark as inactive)
    comment.isActive = false;
    await comment.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error while deleting comment' });
  }
});

// Like/Unlike comment
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const existingLike = comment.likes.find(
      like => like.user.toString() === req.user._id.toString()
    );

    if (existingLike) {
      // Unlike
      comment.likes = comment.likes.filter(
        like => like.user.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      comment.likes.push({
        user: req.user._id,
        likedAt: new Date()
      });
    }

    await comment.save();

    res.json({
      message: existingLike ? 'Comment unliked' : 'Comment liked',
      likesCount: comment.likes.length,
      isLiked: !existingLike
    });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ message: 'Server error while liking comment' });
  }
});

module.exports = router;