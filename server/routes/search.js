const { searchForScans } = require("../controllers/searchController");

  const router = require("express").Router();
  
router.post('/scans',searchForScans);
  
  module.exports = router;
  