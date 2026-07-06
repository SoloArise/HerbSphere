const express = require("express");
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const router = express.Router();

router.route("/").get(getAllCustomers).post(createCustomer);
router.route("/:id").get(getCustomerById).put(updateCustomer).delete(deleteCustomer);

module.exports = router;
