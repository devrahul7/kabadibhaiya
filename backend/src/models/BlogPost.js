const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: String,
  titleNp: String,
  slug: { type: String, unique: true, required: true },
  category: { type: String, enum: ['tips', 'news', 'guide', 'environment'] },
  author: String,
  authorNp: String,
  content: String,
  contentNp: String,
  excerpt: String,
  excerptNp: String,
  thumbnail: { type: String, default: '/images/blog-default.jpg' },
  readTime: Number,
  publishedAt: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: true }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
