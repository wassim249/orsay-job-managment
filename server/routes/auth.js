const { login, registerRequest, getAuthRequests, changeRequestStatus } = require("../controllers/authController");
const router = require("express").Router();

router.post("/login", login);
router.post("/register/request", registerRequest);
router.get("/register/request/all", getAuthRequests);
router.post("/register/request/status", changeRequestStatus);

module.exports = router;
