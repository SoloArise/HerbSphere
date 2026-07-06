const Order = require("../models/Order");

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.find({})
      .populate("customer")
      .populate("products.product");
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer")
      .populate("products.product");

    if (!order) {
      throw createHttpError(404, "Order not found");
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

async function createOrder(req, res, next) {
  try {
    const { customer, products, totalAmount, status } = req.body;

    if (!customer || !products || totalAmount === undefined) {
      throw createHttpError(400, "Customer, products list, and total amount are required");
    }

    const order = await Order.create({ customer, products, totalAmount, status });

    const populatedOrder = await Order.findById(order._id)
      .populate("customer")
      .populate("products.product");

    res.status(201).json({
      success: true,
      data: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  try {
    const { customer, products, totalAmount, status } = req.body;

    if (!customer || !products || totalAmount === undefined) {
      throw createHttpError(400, "Customer, products list, and total amount are required");
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { customer, products, totalAmount, status },
      { new: true, runValidators: true }
    )
      .populate("customer")
      .populate("products.product");

    if (!order) {
      throw createHttpError(404, "Order not found");
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteOrder(req, res, next) {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      throw createHttpError(404, "Order not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
