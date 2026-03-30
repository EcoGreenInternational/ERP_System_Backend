// model/productModel.js - UPDATED WITH DISCOUNT FEATURE
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      index: true  // ✅ defined here — removed from schema.index() below
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },

    hasDiscount: {
      type: Boolean,
      default: false,
      index: true  // ✅ defined here — removed from schema.index() below
    },

    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      validate: {
        validator: function (value) {
          if (this.hasDiscount && value <= 0) return false;
          return true;
        },
        message: "Discount percentage must be greater than 0 when discount is enabled",
      },
    },

    item_count: {
      type: Number,
      default: 0,
      min: [0, "Item count cannot be negative"],
    },

    description: {
      type: String,
      trim: true,
    },

    weight: {
      type: Number,
      min: 0,
    },

    color: {
      type: String,
      trim: true,
    },

    size: {
      type: String,
      trim: true,
      default: "normal",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true  // ✅ defined here — removed from schema.index() below
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true  // ✅ defined here — removed from schema.index() below
    },

    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true  // ✅ defined here — removed from schema.index() below
    },

    mainImage: {
      type: String,
      required: [true, "Main image is required"],
    },

    additionalImages: {
      type: [String],
      default: [],
    },

    sellType: {
      type: String,
      default: "ex",
      enum: ["ex", "wholesale", "retail"],
    },

    categoryType: {
      type: String,
      enum: ["cosmetics", "electronics", "other"],
      default: "other",
      index: true  // ✅ defined here — removed from schema.index() below
    },

    specifications: {
      usage: { type: String, default: "" },
      manufactureCountry: { type: String, default: "" },
      netWeightVolume: { type: String, default: "" },
      suitableFor: { type: String, default: "" },
      hairSkinType: { type: String, default: "" },
      keyIngredients: { type: String, default: "" },
      packaging: { type: String, default: "" },
      shelfLife: { type: String, default: "" },
      model: { type: String, default: "" },
      powerSupply: { type: String, default: "" },
      material: { type: String, default: "" },
      compatibility: { type: String, default: "" },
      warranty: { type: String, default: "" },
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Only compound indexes and non-duplicate single indexes go here
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ categoryId: 1, isActive: 1 });
productSchema.index({ brandId: 1, isActive: 1 });
productSchema.index({ categoryType: 1, isActive: 1 });
productSchema.index({ hasDiscount: 1, isActive: 1 });

// Virtual: in stock check
productSchema.virtual("inStock").get(function () {
  return this.item_count > 0;
});

// Virtual: discounted price
productSchema.virtual("discountedPrice").get(function () {
  if (this.hasDiscount && this.discountPercentage > 0) {
    return this.price * (1 - this.discountPercentage / 100);
  }
  return this.price;
});

// Virtual: display price
productSchema.virtual("displayPrice").get(function () {
  return this.price;
});

// Method: reduce stock
productSchema.methods.reduceStock = function (quantity) {
  if (this.item_count < quantity) throw new Error("Insufficient stock");
  this.item_count -= quantity;
  return this.save();
};

// Method: increase stock
productSchema.methods.increaseStock = function (quantity) {
  this.item_count += quantity;
  return this.save();
};

// Method: check availability
productSchema.methods.isAvailable = function () {
  return this.isActive && this.item_count > 0;
};

// Method: enable discount
productSchema.methods.enableDiscount = function (percentage) {
  if (percentage <= 0 || percentage > 100)
    throw new Error("Discount percentage must be between 1 and 100");
  this.hasDiscount = true;
  this.discountPercentage = percentage;
  return this.save();
};

// Method: disable discount
productSchema.methods.disableDiscount = function () {
  this.hasDiscount = false;
  this.discountPercentage = 0;
  return this.save();
};

// Static methods
productSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

productSchema.statics.findByCategory = function (categoryId) {
  return this.find({ categoryId, isActive: true }).populate("categoryId brandId");
};

productSchema.statics.findByBrand = function (brandId) {
  return this.find({ brandId, isActive: true }).populate("categoryId brandId");
};

productSchema.statics.findByCategoryType = function (categoryType) {
  return this.find({ categoryType, isActive: true }).populate("categoryId brandId");
};

productSchema.statics.findWithDiscount = function () {
  return this.find({ hasDiscount: true, isActive: true }).populate("categoryId brandId");
};

// Pre-save: generate SKU
productSchema.pre("save", async function (next) {
  if (this.isNew && !this.sku) {
    this.sku = `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
