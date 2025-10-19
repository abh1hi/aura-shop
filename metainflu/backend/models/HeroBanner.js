const mongoose = require('mongoose');

const heroBannerSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxLength: [100, 'Title cannot exceed 100 characters']
        },
        subtitle: {
            type: String,
            required: false,
            trim: true,
            maxLength: [200, 'Subtitle cannot exceed 200 characters']
        },
        imageUrl: {
            type: String,
            required: [true, 'Image URL is required'],
            trim: true
        },
        link: {
            type: String,
            required: false,
            trim: true
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

// Add index for better query performance
heroBannerSchema.index({ priority: -1, createdAt: -1 });
heroBannerSchema.index({ active: 1 });

const HeroBanner = mongoose.model('HeroBanner', heroBannerSchema);

module.exports = HeroBanner;