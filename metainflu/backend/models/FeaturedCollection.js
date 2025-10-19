const mongoose = require('mongoose');

const featuredCollectionSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxLength: [100, 'Title cannot exceed 100 characters']
        },
        description: {
            type: String,
            required: false,
            trim: true,
            maxLength: [500, 'Description cannot exceed 500 characters']
        },
        imageUrl: {
            type: String,
            required: [true, 'Image URL is required'],
            trim: true
        },
        category: {
            type: String,
            required: false,
            trim: true,
            maxLength: [50, 'Category cannot exceed 50 characters']
        },
        productIds: {
            type: [String],
            default: [],
            validate: {
                validator: function(arr) {
                    return arr.length <= 50; // Maximum 50 products per collection
                },
                message: 'Cannot have more than 50 products in a collection'
            }
        },
        priority: {
            type: Number,
            default: 0,
            min: [0, 'Priority cannot be negative']
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

// Add indexes for better query performance
featuredCollectionSchema.index({ priority: -1, createdAt: -1 });
featuredCollectionSchema.index({ active: 1 });
featuredCollectionSchema.index({ category: 1 });

const FeaturedCollection = mongoose.model('FeaturedCollection', featuredCollectionSchema);

module.exports = FeaturedCollection;