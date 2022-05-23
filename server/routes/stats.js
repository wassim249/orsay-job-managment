const {
    successVsFailure, getScanInfo
  } = require("../controllers/statsController");
  const router = require("express").Router();
  
  router.get("/successvsfailure", successVsFailure);
  router.get("/scaninfo", getScanInfo);

  
  module.exports = router;
  