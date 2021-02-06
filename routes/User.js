// Libreria de Expressjs
const express = require('express');
const router = express.Router();

const UserController = require('../controllers/User-controller');

router.get('/', UserController.getUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

// Exportamos el router de la libreria express que declaramos arriba
module.exports = router;
