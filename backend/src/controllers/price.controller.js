const Price = require('../models/Price');

// ─── GET ALL PRICES ────────────────────────────────────────────────────────────
exports.getAllPrices = async (req, res, next) => {
  try {
    const prices = await Price.find({ isActive: true }).sort({ category: 1, name: 1 });

    const grouped = prices.reduce((acc, curr) => {
      const cat = curr.category || 'other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(curr);
      return acc;
    }, {});

    res.json({ success: true, categories: grouped, items: prices });
  } catch (err) {
    next(err);
  }
};

// ─── GET BY CATEGORY ───────────────────────────────────────────────────────────
exports.getByCategory = async (req, res, next) => {
  try {
    const prices = await Price.find({ category: req.params.category.toLowerCase(), isActive: true });
    res.json({ success: true, prices });
  } catch (err) {
    next(err);
  }
};

// ─── GET ITEM IMAGE FROM MONGODB ───────────────────────────────────────────────
exports.getPriceImage = async (req, res, next) => {
  try {
    const item = await Price.findById(req.params.id).select('itemImage itemImageType imageUrl');
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    if (item.itemImage) {
      res.set('Content-Type', item.itemImageType || 'image/jpeg');
      res.set('Cache-Control', 'public, max-age=86400');
      return res.send(item.itemImage);
    }

    if (item.imageUrl) {
      return res.redirect(item.imageUrl);
    }

    return res.status(404).json({ success: false, message: 'No image found for this item' });
  } catch (err) {
    next(err);
  }
};

// ─── CREATE NEW PRICE ITEM (ADMIN ONLY) ───────────────────────────────────────
exports.createPrice = async (req, res, next) => {
  try {
    const { name, nameNp, category, price, unit, trend, emoji, imageUrl, notes } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }

    const priceNum = Number(price);
    const itemData = {
      name,
      nameNp: nameNp || '',
      category: (category || 'metal').toLowerCase(),
      price: priceNum,
      unit: unit || 'kg',
      trend: trend || 'stable',
      history: [priceNum, priceNum, priceNum, priceNum, priceNum, priceNum, priceNum],
      emoji: emoji || '📦',
      imageUrl: imageUrl || '',
      notes: notes || '',
    };

    if (req.file) {
      itemData.itemImage = req.file.buffer;
      itemData.itemImageType = req.file.mimetype;
    }

    const item = await Price.create(itemData);
    res.status(201).json({ success: true, message: 'Scrap item created successfully', item });
  } catch (err) {
    next(err);
  }
};

// ─── UPDATE PRICE ITEM (ADMIN ONLY) ───────────────────────────────────────────
exports.updatePrice = async (req, res, next) => {
  try {
    const existing = await Price.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Price item not found' });

    const updates = { updatedAt: Date.now() };

    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.nameNp !== undefined) updates.nameNp = req.body.nameNp;
    if (req.body.category !== undefined) updates.category = req.body.category.toLowerCase();
    if (req.body.unit !== undefined) updates.unit = req.body.unit;
    if (req.body.trend !== undefined) updates.trend = req.body.trend;
    if (req.body.emoji !== undefined) updates.emoji = req.body.emoji;
    if (req.body.imageUrl !== undefined) updates.imageUrl = req.body.imageUrl;
    if (req.body.notes !== undefined) updates.notes = req.body.notes;
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;

    if (req.body.price !== undefined) {
      const newPrice = Number(req.body.price);
      updates.price = newPrice;
      // Append to 7-day history
      updates.history = [...(existing.history || []), existing.price].slice(-7);
    }

    // If an image was uploaded, store in MongoDB
    if (req.file) {
      updates.itemImage = req.file.buffer;
      updates.itemImageType = req.file.mimetype;
    }

    const updated = await Price.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, message: 'Price updated successfully', price: updated });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE PRICE ITEM (ADMIN ONLY) ───────────────────────────────────────────
exports.deletePrice = async (req, res, next) => {
  try {
    const deleted = await Price.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Price item not found' });
    res.json({ success: true, message: 'Price item deleted successfully' });
  } catch (err) {
    next(err);
  }
};
