const mongoose = require('mongoose');
const Order = require('./models/Order');
const Delivery = require('./models/Delivery');
require('dotenv').config();

async function syncOrderStatus() {
  try {
    console.log('=== SYNCING ORDER STATUSES ===');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Get all deliveries
    const deliveries = await Delivery.find().populate('orderId');
    console.log(`Found ${deliveries.length} deliveries`);

    for (const delivery of deliveries) {
      if (delivery.orderId) {
        const currentOrderStatus = delivery.orderId.status;
        const deliveryStatus = delivery.status;
        
        console.log(`Order ${delivery.orderId.orderId}: Current status = ${currentOrderStatus}, Delivery status = ${deliveryStatus}`);

        // Map delivery status to order status
        let newOrderStatus;
        switch (deliveryStatus) {
          case 'COMPLETED':
            newOrderStatus = 'DELIVERED';
            break;
          case 'IN_PROGRESS':
            newOrderStatus = 'OUT_FOR_DELIVERY';
            break;
          case 'PENDING':
            newOrderStatus = 'PENDING';
            break;
          case 'INCOMPLETE':
            newOrderStatus = 'CANCELLED';
            break;
          default:
            newOrderStatus = 'PENDING';
        }

        // Update order status if different
        if (currentOrderStatus !== newOrderStatus) {
          console.log(`Updating order ${delivery.orderId.orderId} status from ${currentOrderStatus} to ${newOrderStatus}`);
          await Order.findByIdAndUpdate(delivery.orderId._id, { status: newOrderStatus });
        } else {
          console.log(`Order ${delivery.orderId.orderId} status already in sync`);
        }
      }
    }

    console.log('=== SYNC COMPLETED ===');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing order status:', error);
    process.exit(1);
  }
}

syncOrderStatus();
