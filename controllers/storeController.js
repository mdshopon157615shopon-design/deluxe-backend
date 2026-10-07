const StoreItem = require('../models/StoreItem');
const UserInventory = require('../models/UserInventory');
const User = require('../models/User');

// 1. Get all active store items
exports.getStoreItems = async (req, res) => {
  try {
    const items = await StoreItem.find({ isActive: true });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Buy item from store (Deduct coins and add to inventory)
exports.buyItem = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    const item = await StoreItem.findById(itemId);
    const user = await User.findById(userId);

    if (!item || !user) {
      return res.status(404).json({ success: false, message: 'User or Item not found' });
    }

    if (user.coins < item.priceInCoins) {
      return res.status(400).json({ success: false, message: 'Insufficient coins!' });
    }

    // Deduct coins
    user.coins -= item.priceInCoins;
    await user.save();

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + item.validityDays);

    // Save to user inventory
    const inventoryItem = new UserInventory({
      userId,
      itemId,
      itemType: item.type,
      expiresAt: expiryDate
    });

    await inventoryItem.save();

    res.json({ 
      success: true, 
      message: 'Item purchased successfully!', 
      remainingCoins: user.coins,
      inventoryItem 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
