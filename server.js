const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'YOUR_ACTUAL_MONGODB_URI';
const JWT_SECRET = process.env.JWT_SECRET || 'deluxe_live_secret_key_123';

const ZEGO_APP_ID = Number(process.env.ZEGO_APP_ID || 123456789); 
const ZEGO_SERVER_SECRET = process.env.ZEGO_SERVER_SECRET || 'your_zego_server_secret_here';

if (MONGO_URI && !MONGO_URI.includes('YOUR_ACTUAL_MONGODB_URI')) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Atlas Connected Successfully!'))
    .catch((err) => console.error('MongoDB Connection Error:', err));
}

app.get('/', (req, res) => {
  res.send('Deluxe Live Backend is Running Successfully!');
});

// ZEGOCLOUD Live Token Helper Function
function generateZegoToken(appId, serverSecret, userId, roomId) {
  const effectiveTime = 3600; 
  const createTime = Math.floor(Date.now() / 1000);
  const nonce = Math.floor(Math.random() * 2147483647);

  const payloadObject = {
    room_id: roomId,
    privilege: { 1: 1, 2: 1 },
    stream_id_list: null
  };

  const payload = JSON.stringify(payloadObject);
  const signatureStr = `${appId}${userId}${createTime}${effectiveTime}${nonce}${payload}`;
  const hash = crypto.createHmac('sha256', serverSecret).update(signatureStr).digest('hex');

  const tokenBytes = Buffer.from(JSON.stringify({
    app_id: appId,
    user_id: userId,
    create_time: createTime,
    effective_time: effectiveTime,
    nonce: nonce,
    payload: payload,
    signature: hash
  }));

  return '04' + tokenBytes.toString('base64');
}

// ZEGOCLOUD Token Route
app.post('/api/zego/token', (req, res) => {
  try {
    const { userId, roomId } = req.body;
    if (!userId || !roomId) {
      return res.status(400).json({ message: 'userId and roomId are required' });
    }

    const token = generateZegoToken(ZEGO_APP_ID, ZEGO_SERVER_SECRET, userId, roomId);
    res.json({ token, appId: ZEGO_APP_ID });
  } catch (error) {
    console.error('Token Error:', error);
    res.status(500).json({ message: 'Failed to generate ZEGO token' });
  }
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'Registration successful!', token, user: { id: newUser._id, name: newUser.name, email: newUser.email, coins: newUser.coins } });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful!', token, user: { id: user._id, name: user.name, email: user.email, coins: user.coins } });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/store/items', (req, res) => {
  res.json([
    { _id: '1', name: 'VIP Status', price: 100 },
    { _id: '2', name: 'Deluxe Frame', price: 250 },
    { _id: '3', name: 'Super Car Entrance', price: 500 }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
