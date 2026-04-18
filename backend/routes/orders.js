const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/', async (req, res) => {
  try {
    // Generate orderId first
    const orderId = await Order.getNextOrderId();
    
    const order = new Order({
      ...req.body,
      orderId: orderId,
      status: 'PENDING'
    });
    
    await order.save();
    
    // Auto-create delivery record for the order
    const deliveryId = await Delivery.getNextDeliveryId();
    const delivery = new Delivery({
      deliveryId: deliveryId,
      orderId: order._id,
      driverName: 'Not Assigned',
      destination: `${req.body.address}, ${req.body.city}, ${req.body.province}`,
      deliveryDate: new Date(),
      status: 'PENDING'
    });
    
    await delivery.save();
    
    console.log('Order saved:', order);
    console.log('Delivery created:', delivery);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Also delete associated delivery
    await Delivery.deleteOne({ orderId: order._id });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// New endpoint to get deliveries
router.get('/deliveries', async (req, res) => {
  try {
    const deliveries = await Delivery.find().populate('orderId');
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

// New endpoint to update delivery status (for drivers)
router.put('/delivery/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('orderId');
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    // Also update the corresponding order status
    if (req.body.status && delivery.orderId) {
      await Order.findByIdAndUpdate(delivery.orderId._id, { status: req.body.status });
    }
    
    res.json(delivery);
  } catch (error) {
    console.error('Error updating delivery:', error);
    res.status(500).json({ error: 'Failed to update delivery' });
  }
});

module.exports = router;
