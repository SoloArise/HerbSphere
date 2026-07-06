const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a valid non-negative number"],
    },
    stock: {
      type: Number,
      required: [true, "Product stock quantity is required"],
      min: [0, "Stock must be a valid non-negative integer"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be an integer value",
      },
    },
    image: {
      type: String,
      default: "/images/placeholder.jpg",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model("Product", productSchema);
