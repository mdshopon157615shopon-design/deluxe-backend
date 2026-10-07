// Store route import
const storeRoutes = require('./routes/storeRoutes');

// Store API middleware
app.use('/api/store', storeRoutes);
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// 1. Business Configuration & Price Chart
const COIN_RATES = [
  { coins: 100000, priceBDT: 1350 },
  { coins: 50000, priceBDT: 675 },
  { coins: 25000, priceBDT: 340 },
  { coins: 20000, priceBDT: 175 }
];

const MASTER_INITIAL_COINS = 500000000; // Admin Master Wallet (500 Million Coins)

// 2. Database Schemas
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  role: { type: String, default: 'user' },
  coins: { type: Number, default: 0 },
  rewardCoins: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  following: [String],
  followers: [String],
  agencyId: String,
  isHostApproved: { type: Boolean, default: false },
  dailyLiveMinutes: { type: Number, default: 0 },
  lastLiveDate: String
});

const TransactionSchema = new mongoose.Schema({
  userId: String,
  paymentMethod: String,
  senderNumber: String,
  amountBDT: Number,
  requestedCoins: Number,
  trxId: { type: String, required: true, unique: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const AgencyApplySchema = new mongoose.Schema({
  userId: String,
  agencyName: String,
  phone: String,
  userLevelAtApply: Number,
  status: { type: String, default: 'pending' }
});

const HostApplySchema = new mongoose.Schema({
  userId: String,
  agencyId: String,
  idProof: String,
  status: { type: String, default: 'pending' }
});

const User = mongoose.model('User', UserSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);
const AgencyApply = mongoose.model('AgencyApply', AgencyApplySchema);
const HostApply = mongoose.model('HostApply', HostApplySchema);

// 3. Health Check Route
app.get('/', (req, res) => {
  res.json({ 
    status: "Active",
    engine: "Deluxe Live Master Backend Engine",
    version: "3.0.0 (Complete Poppo Edition)",
    masterWallet: MASTER_INITIAL_COINS
  });
});

// 4. Recharge Submission Route
app.post('/api/recharge/submit', async (req, res) => {
  try {
    const { userId, paymentMethod, senderNumber, amountBDT, coins, trxId } = req.body;
    
    const existing = await Transaction.findOne({ trxId });
    if (existing) {
      return res.status(400).json({ error: 'This Transaction ID has already been used!' });
    }

    const newTrx = new Transaction({
      userId, paymentMethod, senderNumber, amountBDT, requestedCoins: coins, trxId
    });

    await newTrx.save();
    res.json({ success: true, message: 'Payment request submitted successfully. Waiting for admin approval.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error! Please check your provided parameters.' });
  }
});

// 5. Withdrawal System
app.post('/api/withdraw/request', async (req, res) => {
  const { userId, type, amount } = req.body;
  const user = await User.findOne({ userId });

  if (!user) return res.status(404).json({ error: 'User not found' });

  if (type === 'coin') {
    if (amount < 100000) return res.status(400).json({ error: 'Minimum withdrawal amount is 100,000 coins.' });
    if (user.coins < amount) return res.status(400).json({ error: 'Insufficient coin balance.' });
    user.coins -= amount;
  } else if (type === 'reward') {
    if (amount < 200000) return res.status(400).json({ error: 'Minimum withdrawal amount is 200,000 reward coins.' });
    if (user.rewardCoins < amount) return res.status(400).json({ error: 'Insufficient reward coins balance.' });
    user.rewardCoins -= amount;
  }

  await user.save();
  res.json({ success: true, message: 'Withdrawal request submitted successfully.' });
});

// 6. Agency Application (Level 10 Validation)
app.post('/api/agency/apply', async (req, res) => {
  const { userId, agencyName, phone } = req.body;
  const user = await User.findOne({ userId });

  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.level < 10) {
    return res.status(400).json({ 
      error: `Level 10 required to apply for Agency. Your current level is: ${user.level}` 
    });
  }

  const apply = new AgencyApply({ userId, agencyName, phone, userLevelAtApply: user.level });
  await apply.save();

  res.json({ success: true, message: 'Agency application submitted successfully!' });
});

// 7. Poppo Style 34 Featured Video Feed
app.get('/api/videos/feed', (req, res) => {
  const videoFeed = Array.from({ length: 34 }, (_, i) => ({
    id: i + 1,
    title: `Deluxe Live Video Stream #${i + 1}`,
    videoUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
  }));
  res.json(videoFeed);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
