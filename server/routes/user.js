const { getAllUsers, getUser, editUser } = require('../controllers/usersCOntroller');

const router = require('express').Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', editUser);


module.exports = router;