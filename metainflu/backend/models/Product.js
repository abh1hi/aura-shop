const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true },          // e.g., "Color", "Material"
  value: { type: String, required: true },         // e.g., "Blue", "Cotton"
  hexCode: { type: String },                       // For color display, e.g., "#112233"
  regionCode: { type: String },                    // For regional/language filtered products
  unit: { type: String },                          // For dimensions, weight, etc.
});

// For array attributes (multiple values)
const arrayAttributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  values: [String],
});

// Variant Schema (specific SKU-level differences)
const variantSchema = new mongoose.Schema({
  // Remove unique requirement to avoid DB-level duplicates for null/empty; uniqueness enforced via partial index
  sku: { type: String, required: true },
  attributes: [attributeSchema],                  // e.g. {name: "Size", value: "L"}
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  regionAvailability: [{
    regionCode: { type: String },
    available: { type: Boolean, default: true },
  }],
});

// Main Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  brand: { type: String },
  modelNumber: { type: String },                          // MPN/Model
  gtin: { type: String },                                 // Global Trade Item Number/barcode/ISBN
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  attributes: [attributeSchema],                          // For global product attributes
  arrayAttributes: [arrayAttributeSchema],                // For attributes like certifications, features, includedItems
  variants: [variantSchema],
  images: [{
    url: { type: String },
    altText: { type: String },
    position: { type: Number },
    variantSku: { type: String, default: null }
  }],
  weight: { type: Number },                               // Numeric (with unit in attribute)
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    unit: { type: String },                               // For dimension units (cm/inch)
  },
  pattern: { type: String },                              // "Striped", "Checked", "Solid"
  style: { type: String },                                // "Boho", "Formal", etc.
  ageGroup: { type: String },                             // "Adult", "Infant", etc.
  gender: { type: String },                               // "Men", "Women", "Unisex"
  releaseYear: { type: String },                          // "2025"
  season: { type: String },                               // "Spring", "Autumn", ...
  careInstructions: { type: String },                     // "Hand wash"
  warranty: { type: String },                             // "2 years manufacturer"
  sustainability: [String],                               // e.g., ["Vegan", "FSC"]
  certifications: [String],                               // e.g., ["CE", "FCC"]
  power: {
    voltage: { type: Number },
    unit: { type: String, default: "V" },
  },                                                      // e.g. {voltage: 220, unit:"V"}
  technicalSpecs: [{
    key: { type: String },                                // "RAM", "Battery Type"
    value: { type: String },
  }],
  ingredients: [String],                                  // Cosmetics/food allergen info
  expirationDate: { type: Date },                         // For perishables
  safetyWarnings: { type: String },
  inTheBox: [String],                                     // "Charger", "Manual", ...
  bundleContents: [String],
  regionOfOrigin: { type: String },                       // Country, region, e.g., "India"
  user: {                                                 // Vendor/seller
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [String],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
}, { timestamps: true });

// Add a partial unique index on variants.sku so uniqueness applies only when a non-empty string exists
productSchema.index(
  { 'variants.sku': 1 },
  { unique: true, partialFilterExpression: { 'variants.sku': { $exists: true, $type: 'string', $ne: '' } } }
);

module.exports = mongoose.model('Product', productSchema);
