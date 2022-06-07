const { login, registerRequest, getAuthRequests } = require("../controllers/authController");
const router = require("express").Router();

router.post("/login", login);
router.get("/register/request", registerRequest);
router.get("/register/request/all", getAuthRequests);

module.exports = router;
