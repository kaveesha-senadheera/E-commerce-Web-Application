const mongoose = require('mongoose');

// User schema with optional fields to support flexible registration
// TODO: Add validation middleware for phone/email format
const userSchema = new mongoose.Schema({
    username: { type: String, required: false },
    role: { type: String, enum: ['customer', 'seller'], required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false, unique: false } // Warning: unique:false allows duplicates
});

module.exports = mongoose.model('User', userSchema);