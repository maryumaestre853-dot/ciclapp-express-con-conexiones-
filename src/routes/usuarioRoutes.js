const express = require('express');
const router = express.Router();
const c = require('../controllers/usuarioController');
const validarCuerpo = require('../middlewares/validarCuerpo');

router.post('/registro', validarCuerpo, c.registrarUsuario); // 7
router.post('/login', validarCuerpo, c.loginUsuario);        // 8
router.get('/', c.listarUsuarios);                           // 9

module.exports = router;
