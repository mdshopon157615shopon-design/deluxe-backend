import StoreItem from '../models/StoreItem.js';

// Get all store items
export const getItems = async (req, res) => {
  try {
    const items = await StoreItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buy an item
export const buyItem = async (req, res) => {
  try {
    const { itemId, userId } = req.body;
    // purchase logic here
    res.json({ success: true, message: 'Item purchased successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getItems,
  buyItem
};

