const express = require("express");
const dashboard = require("../data/dashboard");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: dashboard,
  });
});

module.exports = router;
