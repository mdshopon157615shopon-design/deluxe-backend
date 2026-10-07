import express from 'express';
import storeController from '../controllers/storeController.js';

const router = express.Router();

// Get all store items
router.get('/items', storeController.getItems);

// Buy an item
router.post('/buy', storeController.buyItem);

export default router;

