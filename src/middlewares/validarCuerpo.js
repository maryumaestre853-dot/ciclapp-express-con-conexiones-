const ErrorApp = require('../services/errores');

// Middleware de ruta: rechaza peticiones POST/PUT/PATCH sin cuerpo JSON
const validarCuerpo = (req, res, next) => {
  if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
    return next(new ErrorApp('El cuerpo de la petición no puede estar vacío', 400));
  }
  next();
};

module.exports = validarCuerpo;
