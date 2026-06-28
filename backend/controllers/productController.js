const products = require("../data/products");

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parseProductId(id) {
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    throw createHttpError(400, "Invalid product ID");
  }

  return productId;
}

function validateProductPayload(body) {
  const { name, category, price, stock, description } = body;

  if (!name || !category || price === undefined || stock === undefined || !description) {
    throw createHttpError(400, "Name, category, price, stock, and description are required");
  }

  const numericPrice = Number(price);
  const numericStock = Number(stock);

  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    throw createHttpError(400, "Price must be a valid non-negative number");
  }

  if (!Number.isInteger(numericStock) || numericStock < 0) {
    throw createHttpError(400, "Stock must be a valid non-negative integer");
  }

  return {
    name: String(name).trim(),
    category: String(category).trim(),
    price: numericPrice,
    stock: numericStock,
    description: String(description).trim(),
  };
}

function getAllProducts(req, res) {
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
}

function getProductById(req, res, next) {
  try {
    const productId = parseProductId(req.params.id);
    const product = products.find((item) => item.id === productId);

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

function createProduct(req, res, next) {
  try {
    const productData = validateProductPayload(req.body);
    const nextId = products.length ? Math.max(...products.map((product) => product.id)) + 1 : 1;
    const product = {
      id: nextId,
      ...productData,
    };

    products.push(product);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

function updateProduct(req, res, next) {
  try {
    const productId = parseProductId(req.params.id);
    const productIndex = products.findIndex((item) => item.id === productId);

    if (productIndex === -1) {
      throw createHttpError(404, "Product not found");
    }

    const productData = validateProductPayload(req.body);
    products[productIndex] = {
      id: productId,
      ...productData,
    };

    res.status(200).json({
      success: true,
      data: products[productIndex],
    });
  } catch (error) {
    next(error);
  }
}

function deleteProduct(req, res, next) {
  try {
    const productId = parseProductId(req.params.id);
    const productIndex = products.findIndex((item) => item.id === productId);

    if (productIndex === -1) {
      throw createHttpError(404, "Product not found");
    }

    products.splice(productIndex, 1);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

function searchProducts(req, res) {
  const query = String(req.query.q || "").trim().toLowerCase();

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  const results = products.filter((product) => {
    return [product.name, product.category, product.description].some((value) =>
      value.toLowerCase().includes(query)
    );
  });

  return res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};
