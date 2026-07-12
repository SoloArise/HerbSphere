const express = require("express");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 20 } });
    const totalOrders = await Order.countDocuments();

    const ordersForRevenue = await Order.find({});
    const totalRevenueSum = ordersForRevenue.reduce((sum, order) => sum + order.totalAmount, 0);

    const recentOrdersDb = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customer")
      .populate("products.product");

    const metrics = [
      {
        label: "Total Revenue",
        value: `Rs. ${totalRevenueSum.toLocaleString()}`,
        sub: "Real-time revenue",
      },
      {
        label: "Total Orders",
        value: totalOrders.toString(),
        sub: "Total registered orders",
      },
      {
        label: "Inventory Items",
        value: totalProducts.toString(),
        sub: `${lowStockCount} low stock alerts`,
      },
    ];

    const orders = recentOrdersDb.map((order) => {
      const productNames = order.products
        .map((p) => (p.product ? p.product.name : "Unknown Product"))
        .join(", ");

      const dateFormatted = order.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return {
        id: `HS-${order._id.toString().substring(19, 24).toUpperCase()}`,
        customer: order.customer ? order.customer.name : "Guest",
        product: productNames || "N/A",
        amount: `Rs. ${order.totalAmount.toLocaleString()}`,
        date: dateFormatted,
        status: order.status,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        period: "Live Database",
        metrics,
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
