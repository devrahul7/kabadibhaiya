const Price = require('../models/Price');

exports.getAllPrices = async (req, res, next) => {
  try {
    const prices = await Price.find({ isActive: true });
    
    // Group by category
    const grouped = prices.reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      acc[curr.category].push(curr);
      return acc;
    }, {});

    res.json({ success: true, categories: grouped, items: prices });
  } catch (err) {
    next(err);
  }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const prices = await Price.find({ category: req.params.category, isActive: true });
    res.json({ success: true, prices });
  } catch (err) {
    next(err);
  }
};

exports.updatePrice = async (req, res, next) => {
  try {
    const { price, trend } = req.body;
    const existing = await Price.findById(req.params.id);
    
    if (!existing) return res.status(404).json({ success: false, message: 'Price item not found' });
    
    // Update history
    const history = [...existing.history, existing.price].slice(-7);
    
    const updated = await Price.findByIdAndUpdate(
      req.params.id, 
      { price, trend, history, updatedAt: Date.now() },
      { new: true }
    );
    
    res.json({ success: true, price: updated });
  } catch (err) {
    next(err);
  }
};
