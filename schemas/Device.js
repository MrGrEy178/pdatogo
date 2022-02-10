const mongoose = require('mongoose');

const Device = new mongoose.schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: Object,
        required: true
    },
    images: {
        type: Array,
        required: false
    }
});

module.exports = mongoose.model('Device', Device);