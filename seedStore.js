const mongoose = require('mongoose');
const StoreItem = require('./models/StoreItem');

// MongoDB Connection Link
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/deluxelive';

const sampleItems = [
  {
    title: 'Gold Crown Frame',
    type: 'AVATAR_FRAME',
    previewUrl: 'https://via.placeholder.com/150/FFD700/000000?text=Gold+Frame',
    priceInCoins: 500,
    validityDays: 30
  },
  {
    title: 'VIP King Badge',
    type: 'VIP_BADGE',
    previewUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=VIP+Badge',
    priceInCoins: 1000,
    validityDays: 30
  },
  {
    title: 'Dragon Entrance Effect',
    type: 'ENTRANCE_EFFECT',
    previewUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Dragon+Effect',
    priceInCoins: 1500,
    validityDays: 15
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await StoreItem.deleteMany({}); // Clears existing items
    await StoreItem.insertMany(sampleItems);
    console.log('✅ Store Items Added Successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error Seeding Data:', error.message);
  }
};

seedDB();
