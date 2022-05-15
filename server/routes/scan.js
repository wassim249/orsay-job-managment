const { createScan, getScan } = require('../controllers/scanController');
const router = require('express').Router();

router.post('/create', createScan);
router.get('/:id', getScan);

module.exports = router;