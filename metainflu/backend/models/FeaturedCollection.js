
const mongoose = require('mongoose');

const featuredCollectionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
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

const FeaturedCollection = mongoose.model('FeaturedCollection', featuredCollectionSchema);

module.exports = FeaturedCollection;
