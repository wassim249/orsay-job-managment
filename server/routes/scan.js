const {
  createScan,
  getScan,
  getAllScans,
  scheduleScan,
} = require("../controllers/scanController");
const router = require("express").Router();

router.post("/create", createScan);
router.post("/schedule", scheduleScan);
router.get("/:id", getScan);
router.get("/", getAllScans);

module.exports = router;
