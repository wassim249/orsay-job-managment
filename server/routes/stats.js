const {
  successVsFailure,
  getScanInfo,
  failedReason,
  newUsers,
} = require("../controllers/statsController");
const router = require("express").Router();

router.post("/successvsfailure", successVsFailure);
router.post("/scaninfo", getScanInfo);
router.post("/failedreason", failedReason);
router.post("/newusers", newUsers);

module.exports = router;
