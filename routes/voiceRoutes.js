import express from 'express';

const router = express.Router();

// Get active voice rooms
router.get('/rooms', (req, res) => {
  res.json({
    success: true,
    rooms: [
      { id: '1', name: 'Main Lounge', host: 'Admin', activeUsers: 5 },
      { id: '2', name: 'Music Corner', host: 'DJ Live', activeUsers: 12 }
    ]
  });
});

export default router;
