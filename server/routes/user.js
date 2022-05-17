const { getAllUsers, getUser, editUser, createUser } = require('../controllers/usersCOntroller');

const router = require('express').Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', editUser);
router.post('/', createUser);


module.exports = router;