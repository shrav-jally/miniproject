const mongoose = require('mongoose');

const visitCountSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('VisitCount', visitCountSchema); 