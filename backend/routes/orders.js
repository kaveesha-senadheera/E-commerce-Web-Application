const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const { auth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    // Generate orderId first
    const orderId = await Order.getNextOrderId();
    
    const order = new Order({
      ...req.body,
      orderId: orderId,
      userId: req.user._id, // Add current user's ID
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
    console.log('=== DELIVERY UPDATE DEBUG ===');
    console.log('Updating delivery with ID:', req.params.id);
    console.log('Delivery update data:', req.body);
    
    // First, find the delivery to get the order information
    const delivery = await Delivery.findById(req.params.id).populate('orderId');
    
    if (!delivery) {
      console.log('Delivery not found');
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    console.log('Original delivery:', delivery);
    console.log('Delivery orderId field:', delivery.orderId);
    console.log('Delivery orderId type:', typeof delivery.orderId);
    
    // Update the delivery first
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('orderId');
    
    console.log('Delivery updated successfully:', updatedDelivery);
    
    // CRITICAL: Always update the corresponding order status if status is provided
    if (req.body.status && delivery.orderId) {
      console.log('=== ORDER UPDATE START ===');
      console.log('Updating order status for order ID:', delivery.orderId._id);
      console.log('New status:', req.body.status);
      
      try {
        // Get the order ID - handle different possible structures
        let orderIdToUpdate;
        if (typeof delivery.orderId === 'object' && delivery.orderId._id) {
          orderIdToUpdate = delivery.orderId._id;
        } else if (typeof delivery.orderId === 'string') {
          orderIdToUpdate = delivery.orderId;
        } else {
          orderIdToUpdate = delivery.orderId;
        }
        
        console.log('Final order ID to update:', orderIdToUpdate);
        
        const updatedOrder = await Order.findByIdAndUpdate(
          orderIdToUpdate, 
          { status: req.body.status },
          { new: true }
        );
        
        console.log('Order updated successfully:', updatedOrder);
        console.log('=== ORDER UPDATE END ===');
        
        // Return both updated delivery and order for frontend
        res.json({
          delivery: updatedDelivery,
          order: updatedOrder,
          message: 'Delivery and order status updated successfully'
        });
        
      } catch (orderError) {
        console.error('Error updating order:', orderError);
        // Still return the delivery update even if order update fails
        res.json({
          delivery: updatedDelivery,
          error: 'Delivery updated but order status update failed'
        });
      }
    } else {
      console.log('=== NO ORDER UPDATE ===');
      console.log('req.body.status:', req.body.status);
      console.log('delivery.orderId:', delivery.orderId);
      if (!req.body.status) console.log('No status provided in request');
      if (!delivery.orderId) console.log('No orderId found in delivery');
      
      res.json(updatedDelivery);
    }
    
  } catch (error) {
    console.error('Error updating delivery:', error);
    res.status(500).json({ error: 'Failed to update delivery' });
  }
});

// Customer-specific endpoints
router.get('/customer', auth, async (req, res) => {
  try {
    const customerOrders = await Order.find({ userId: req.user._id });
    res.json(customerOrders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
});

// Get order by Order ID (for delivery creation)
router.get('/by-id/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Customer-specific deliveries endpoint
router.get('/deliveries/customer', auth, async (req, res) => {
  try {
    // First get customer's orders
    const customerOrders = await Order.find({ userId: req.user._id });
    const customerOrderIds = customerOrders.map(order => order._id);
    
    // Then get deliveries for those orders
    const customerDeliveries = await Delivery.find({ 
      orderId: { $in: customerOrderIds } 
    }).populate('orderId');
    
    res.json(customerDeliveries);
  } catch (error) {
    console.error('Error fetching customer deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch customer deliveries' });
  }
});

module.exports = router;
