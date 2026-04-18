const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');

router.get('/', async (req, res) => {
  try {
    const deliveries = await Delivery.find().populate('orderId');
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

router.post('/', async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    
    console.log('Delivery saved:', delivery);
    res.status(201).json(delivery);
  } catch (error) {
    console.error('Error creating delivery:', error);
    res.status(500).json({ error: 'Failed to create delivery' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('orderId');
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    res.json(delivery);
  } catch (error) {
    console.error('Error updating delivery:', error);
    res.status(500).json({ error: 'Failed to update delivery' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting delivery:', error);
    res.status(500).json({ error: 'Failed to delete delivery' });
  }
});

module.exports = router;
