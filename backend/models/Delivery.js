const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    // User-readable delivery ID (auto-generated)
    deliveryId: { 
        type: String, 
        required: true, 
        unique: true
    },
    
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: false // Optional to allow standalone deliveries
    },
    driverName: {
        type: String,
        required: false // Should be required in production
    },
    destination: {
        type: String,
        required: false // Matches Order.province but should be validated
    },
    deliveryDate: {
        type: Date,
        required: false // Should have min/max validation
    },
    status: {
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'INCOMPLETE'],
        default: 'PENDING' // Simple state machine - consider adding transitions
    }
}, { timestamps: true });

deliverySchema.statics.getNextDeliveryId = async function() {
    const lastDelivery = await this.findOne({}, { deliveryId: 1 })
        .sort({ createdAt: -1 })
        .exec();
    
    if (!lastDelivery || !lastDelivery.deliveryId) {
        return 'DEL1000';
    }
    
    const lastNumber = parseInt(lastDelivery.deliveryId.replace('DEL', ''));
    const nextNumber = lastNumber + 1;
    return `DEL${nextNumber}`;
};

/**
 * Comparison with other models:
 * - User model has similar optional fields (phone/email)
 * - Order schema lacks delivery reference (one-way relationship)
 * - All models share Mongoose but have inconsistent validation approaches
 * 
 * Potential improvements:
 * 1. Add pre-save hook to validate deliveryDate > orderDate
 * 2. Implement driver license number validation
 * 3. Add geolocation tracking fields
 * 4. Create indexes for frequent status queries
 */

module.exports = mongoose.model('Delivery', deliverySchema);