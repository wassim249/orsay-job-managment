const {
  searchForScans,
  searchForOrders,
} = require("../controllers/searchController");

const router = require("express").Router();

router.post("/scans", searchForScans);
router.post("/orders", searchForOrders);

module.exports = router;
