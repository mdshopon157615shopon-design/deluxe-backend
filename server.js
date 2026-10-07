import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import storeRoutes from './routes/storeRoutes.js';

const app = express();

app.use(express.json());
app.use(cors());

// Store API middleware
app.use('/api/store', storeRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://Aadami:11sa22ww@cluster0.423rfjb.mongodb.net/deluxelive?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ Database Connection Error:', err));

// 1. Business Configuration & Price Chart
const COIN_RATES = [
  { coins: 100000, priceBDT: 1350 },
  { coins: 50000, priceBDT: 675 },
  { coins: 25000, priceBDT: 340 },
  { coins: 20000, priceBDT: 175 }
];

const MASTER_INITIAL_COINS = 50000000;

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Deluxe Live Backend Server is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

