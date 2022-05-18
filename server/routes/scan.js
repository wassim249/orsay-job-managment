const {
  createScan,
  getScan,
  getAllScans,
} = require("../controllers/scanController");
const router = require("express").Router();

router.post("/create", createScan);
router.get("/:id", getScan);
router.get("/", getAllScans);

module.exports = router;
