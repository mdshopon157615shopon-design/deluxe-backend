import mongoose from 'mongoose';

const storeItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['AVATAR_FRAME', 'ENTRANCE_EFFECT', 'VIP_BADGE'] 
  },
  previewUrl: { type: String, required: true },
  priceInCoins: { type: Number, required: true },
  validityDays: { type: Number, default: 30 }
}, { timestamps: true });

const StoreItem = mongoose.model('StoreItem', storeItemSchema);
export default StoreItem;

