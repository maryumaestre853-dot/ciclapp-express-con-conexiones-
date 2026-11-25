const service = require('../services/productoService');

// Cada controlador: extrae datos del req, delega al service y responde con el código HTTP.
// Los errores se pasan con next(error) al middleware global de errores.

// 1. POST /api/productos
exports.crearProducto = async (req, res, next) => {
  try {
    const data = await service.crear(req.body);
    res.status(201).json({ status: 'OK', data });
  } catch (error) { next(error); }
};

// 2. GET /api/productos
exports.obtenerProductos = async (req, res, next) => {
  try {
    const data = await service.listar();
    res.status(200).json({ status: 'OK', total: data.length, data });
  } catch (error) { next(error); }
};

// 3. GET /api/productos/:id
exports.obtenerProductoPorId = async (req, res, next) => {
  try {
    const data = await service.obtenerPorId(req.params.id);
    res.status(200).json({ status: 'OK', data });
  } catch (error) { next(error); }
};

// 4. PUT /api/productos/:id
exports.actualizarProducto = async (req, res, next) => {
  try {
    const data = await service.actualizar(req.params.id, req.body);
    res.status(200).json({ status: 'OK', data });
  } catch (error) { next(error); }
};

// 5. DELETE /api/productos/:id
exports.eliminarProducto = async (req, res, next) => {
  try {
    await service.eliminar(req.params.id);
    res.status(200).json({ status: 'OK', message: 'Producto eliminado con éxito' });
  } catch (error) { next(error); }
};

// 6. GET /api/productos/categoria/:cat
exports.filtrarPorCategoria = async (req, res, next) => {
  try {
    const data = await service.filtrarPorCategoria(req.params.cat);
    res.status(200).json({ status: 'OK', categoria: req.params.cat, total: data.length, data });
  } catch (error) { next(error); }
};
