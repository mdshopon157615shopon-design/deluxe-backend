const mongoose = require('mongoose');

const storeItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['AVATAR_FRAME', 'ENTRANCE_EFFECT', 'VIP_BADGE'], 
    required: true 
  },
  previewUrl: { type: String, required: true },
  animationUrl: { type: String, default: '' },
  priceInCoins: { type: Number, required: true },
  validityDays: { type: Number, default: 30 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('StoreItem', storeItemSchema);

