const { login, registerRequest } = require("../controllers/authController");
const router = require("express").Router();

router.post("/login", login);
router.get("/register/request", registerRequest);

module.exports = router;
