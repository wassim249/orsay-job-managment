const {
  successVsFailure,
  getScanInfo,
  failedReason,
  newUsers,
} = require("../controllers/statsController");
const router = require("express").Router();

router.get("/successvsfailure", successVsFailure);
router.get("/scaninfo", getScanInfo);
router.get("/failedreason", failedReason);
router.get("/newusers", newUsers);

module.exports = router;
