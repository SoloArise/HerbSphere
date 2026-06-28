const express = require("express");
const insights = require("../data/insights");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: insights,
  });
});

module.exports = router;
