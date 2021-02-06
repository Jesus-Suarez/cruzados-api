const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/Auth-controller');

router.post('/signup', AuthController.signUp);
router.get('/confirmation/:token', AuthController.confirmationEmail);
router.post('/signIn', AuthController.signIn);

module.exports = router;
