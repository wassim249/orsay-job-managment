const { getAllOrders } = require("../controllers/orderController");
const router = require("express").Router();

router.get("/", getAllOrders);

module.exports = router;
