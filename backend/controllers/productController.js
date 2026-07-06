const Product = require("../models/Product");

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getAllProducts(req, res, next) {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw createHttpError(404, "Product not found");
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, category, price, stock, description, image } = req.body;

    if (!name || !category || price === undefined || stock === undefined || !description) {
      throw createHttpError(400, "Name, category, price, stock, and description are required");
    }

    const product = await Product.create({
      name,
      category,
      price,
      stock,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { name, category, price, stock, description, image } = req.body;

    if (!name || !category || price === undefined || stock === undefined || !description) {
      throw createHttpError(400, "Name, category, price, stock, and description are required");
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, price, stock, description, image },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw createHttpError(404, "Product not found");
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw createHttpError(404, "Product not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function searchProducts(req, res, next) {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      throw createHttpError(400, "Search query is required");
    }

    const results = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};
