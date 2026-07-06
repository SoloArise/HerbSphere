const Customer = require("../models/Customer");

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getAllCustomers(req, res, next) {
  try {
    const customers = await Customer.find({});
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
}

async function getCustomerById(req, res, next) {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      throw createHttpError(404, "Customer not found");
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
}

async function createCustomer(req, res, next) {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone || !address) {
      throw createHttpError(400, "Name, email, phone, and address are required");
    }

    const customer = await Customer.create({ name, email, phone, address });

    res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
}

async function updateCustomer(req, res, next) {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone || !address) {
      throw createHttpError(400, "Name, email, phone, and address are required");
    }

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address },
      { new: true, runValidators: true }
    );

    if (!customer) {
      throw createHttpError(404, "Customer not found");
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteCustomer(req, res, next) {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      throw createHttpError(404, "Customer not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
