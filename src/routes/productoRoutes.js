const express = require('express');
const router = express.Router();
const c = require('../controllers/productoController');
const validarId = require('../middlewares/validarId');
const validarCuerpo = require('../middlewares/validarCuerpo');

// Las rutas solo declaran: método + path + middlewares + controlador
router.post('/', validarCuerpo, c.crearProducto);                      // 1
router.get('/', c.obtenerProductos);                                   // 2
// IMPORTANTE: esta ruta va antes de '/:id' para que no la confunda con un id
router.get('/categoria/:cat', c.filtrarPorCategoria);                  // 6
router.get('/:id', validarId(), c.obtenerProductoPorId);               // 3
router.put('/:id', validarId(), validarCuerpo, c.actualizarProducto);  // 4
router.delete('/:id', validarId(), c.eliminarProducto);                // 5

module.exports = router;
