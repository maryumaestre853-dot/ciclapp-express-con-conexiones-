const express = require('express');
const router = express.Router();
const { estadoConexiones } = require('../config/db');

// GET /api/health -> hace ping real a MongoDB y MySQL (200 si ambas responden, 503 si no)
router.get('/', async (req, res, next) => {
  try {
    const bases = await estadoConexiones();
    const ok = bases.mongodb.estado === 'conectado' && bases.mysql.estado === 'conectado';
    res.status(ok ? 200 : 503).json({ status: ok ? 'OK' : 'Error', ...bases });
  } catch (error) { next(error); }
});

module.exports = router;
