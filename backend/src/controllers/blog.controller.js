const BlogPost = require('../models/BlogPost');
const { sanitizeContent } = require('../utils/sanitize');

exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const category = req.query.category;
    
    const query = { isPublished: true };
    if (category) query.category = category;
    
    const skip = (page - 1) * limit;
    
    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content -contentNp'); // Exclude full content for list
      
    const total = await BlogPost.countDocuments(query);
    
    res.json({
      success: true,
      posts,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

exports.getPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    
    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const data = req.body;
    
    if (data.content) data.content = sanitizeContent(data.content);
    if (data.contentNp) data.contentNp = sanitizeContent(data.contentNp);
    
    const post = await BlogPost.create(data);
    res.status(201).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};
