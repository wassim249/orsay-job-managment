const {
    successVsFailure, getScanInfo, failedReason
  } = require("../controllers/statsController");
  const router = require("express").Router();
  
  router.get("/successvsfailure", successVsFailure);
  router.get("/scaninfo", getScanInfo);
  router.get("/failedreason", failedReason);

  
  module.exports = router;
  