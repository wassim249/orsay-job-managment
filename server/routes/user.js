const { getAllUsers, getUser } = require('../controllers/usersCOntroller');

const router = require('express').Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);


module.exports = router;