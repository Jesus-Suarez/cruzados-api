const express = require('express');
const router = express.Router();

const upload = require('../libs/Storage');

const AuthController = require('../controllers/Auth-controller');

//Para registrarse
router.post('/signup', AuthController.signUp);
//router.post('/signup', upload.single('imgUrl'), AuthController.signUp);
//Confirmar correo electronico
router.get('/confirmation/:token', AuthController.confirmationEmail);
//Iniciar sesion
router.post('/signin', AuthController.signIn);

//Email para recuperar la contraseña
router.post('/email/password/reset', AuthController.emailPasswordReset);

//Recuperar contraseña
router.post('/password/reset/:token', AuthController.recoverPassword);

//Cambiar la contraseña
router.post('/password/change/:token', AuthController.changePassword);

module.exports = router;
