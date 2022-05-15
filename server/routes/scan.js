const { createScan } = require('../controllers/scanController');
const router = require('express').Router();

router.post('/create', createScan);

module.exports = router;