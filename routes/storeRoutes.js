const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Get all store items
router.get('/items', storeController.getStoreItems);

// Buy an item
router.post('/buy', storeController.buyItem);

module.exports = router;
