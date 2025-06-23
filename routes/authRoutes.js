const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');

console.log('register:', register);
console.log('login:', login);

router.post('/register', register);    // POST /api/auth/register
router.post('/login', login);          // POST /api/auth/login

module.exports = router;  // <-- exporta el router, no las funciones





