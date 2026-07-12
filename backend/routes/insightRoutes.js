const express = require("express");
const insights = require("../data/insights");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: insights,
  });
});

module.exports = router;
