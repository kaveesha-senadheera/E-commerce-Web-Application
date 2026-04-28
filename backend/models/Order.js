const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // User reference - now enabled for user-specific orders
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // User-readable order ID (auto-generated)
    orderId: { 
        type: String, 
        required: true, 
        unique: true
    },

    // Frontend-required fields marked optional in backend (data consistency risk)
    firstName: { type: String, required: false }, // Frontend enforces required but backend allows null
    lastName: { type: String, required: false }, // Should match frontend validation if data integrity needed
    address: { type: String, required: false }, // Consider adding length validation
    province: { type: String, required: false }, // Could implement enum for valid provinces
    city: { type: String, required: false }, // Coordinate with frontend's city selection
    postalCode: { type: String, required: false }, // Add regex validation for postal format
    mobileNo: { type: String, required: false }, // Add phone number format validation

    // Payment method enum matches frontend options but has empty default state
    paymentMethod: {
        type: String,
        enum: ['CASH_ON_DELIVERY', 'PAY_ONLINE'], // Frontend has empty default option not in enum
        required: false // Should be required if payment is mandatory
    },

    // Order status field - was missing from original schema
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    }
}, { timestamps: true });

orderSchema.statics.getNextOrderId = async function() {
    const lastOrder = await this.findOne({}, { orderId: 1 })
        .sort({ createdAt: -1 })
        .exec();
    
    if (!lastOrder || !lastOrder.orderId) {
        return 'ORD1000';
    }
    
    const lastNumber = parseInt(lastOrder.orderId.replace('ORD', ''));
    const nextNumber = lastNumber + 1;
    return `ORD${nextNumber}`;
};

module.exports = mongoose.model('Order', orderSchema);