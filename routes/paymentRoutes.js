import express from 'express';

const router = express.Router();

// Initiate Payment Process
router.post('/checkout', (req, res) => {
  const { amount, paymentMethod } = req.body;
  res.json({
    success: true,
    message: `Payment initiated via ${paymentMethod || 'bKash'} for ${amount} coins`,
    transactionId: 'TXN_' + Date.now()
  });
});

export default router;
