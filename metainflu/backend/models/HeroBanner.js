
const mongoose = require('mongoose');

const heroBannerSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: true,
        },
        cta: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const HeroBanner = mongoose.model('HeroBanner', heroBannerSchema);

module.exports = HeroBanner;
