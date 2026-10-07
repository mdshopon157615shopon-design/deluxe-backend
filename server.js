const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'YOUR_MONGODB_ATLAS_CONNECTION_STRING';
const JWT_SECRET = process.env.JWT_SECRET || 'deluxe_live_secret_key_123';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected Successfully!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

app.get('/', (req, res) => {
  res.send('Deluxe Live Backend is Running Successfully!');
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        coins: newUser.coins
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        coins: user.coins
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
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
