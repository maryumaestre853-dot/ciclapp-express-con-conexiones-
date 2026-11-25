const express = require('express');
const router = express.Router();
const c = require('../controllers/reporteController');

router.get('/estadisticas', c.obtenerEstadisticas); // 10

module.exports = router;
