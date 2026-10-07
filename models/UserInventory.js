const mongoose = require('mongoose');

const userInventorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreItem', required: true },
  itemType: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isEquipped: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('UserInventory', userInventorySchema);

