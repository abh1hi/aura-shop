
const mongoose = require('mongoose');

const shippingInfoSchema = mongoose.Schema(
    {
        freeShipping: {
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
        },
        easyReturns: {
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

const ShippingInfo = mongoose.model('ShippingInfo', shippingInfoSchema);

module.exports = ShippingInfo;
