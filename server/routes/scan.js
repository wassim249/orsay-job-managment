const {
  createScan,
  getScan,
  getAllScans,
  scheduleScan,
} = require("../controllers/scanController");
const router = require("express").Router();

router.post("/create", createScan);
router.post("/schedule", scheduleScan);
router.post("/:id", getScan);
router.post("/", getAllScans);

module.exports = router;
