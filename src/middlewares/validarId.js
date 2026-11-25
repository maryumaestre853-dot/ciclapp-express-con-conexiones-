const mongoose = require('mongoose');
const ErrorApp = require('../services/errores');

// Middleware de ruta: verifica que el parámetro (por defecto :id) sea un ObjectId válido
// Uso: router.get('/:id', validarId(), c.obtenerPorId)
const validarId = (parametro = 'id') => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[parametro])) {
    return next(new ErrorApp(`El parámetro '${parametro}' no es un ID válido`, 400));
  }
  next();
};

module.exports = validarId;
