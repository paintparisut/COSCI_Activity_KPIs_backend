const mongoose = require('mongoose');

const schema = mongoose.Schema({
    email: String,
    otp: String,
    expired: Date,
    created: { type: Date, default: Date.now }
});

schema.index({ email: 1}, { unique: true });
module.exports = mongoose.model('otps', schema)
