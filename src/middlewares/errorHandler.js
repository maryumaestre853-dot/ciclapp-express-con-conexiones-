// Middleware 404: se ejecuta cuando ninguna ruta coincidió
const rutaNoEncontrada = (req, res) => {
  res.status(404).json({ status: 'Error', error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// Middleware de errores (4 parámetros): único lugar donde se traduce un error a respuesta HTTP
const manejarErrores = (error, req, res, next) => {
  let status = error.status || 500;
  let mensaje = error.message;

  if (error.type === 'entity.parse.failed') {          // JSON mal formado en el body
    status = 400;
    mensaje = 'El cuerpo de la petición no es un JSON válido';
  } else if (error.name === 'ValidationError') {      // validación de Mongoose
    status = 400;
  } else if (error.name === 'CastError') {            // tipo de dato incorrecto
    status = 400;
    mensaje = `Valor no válido para '${error.path}'`;
  } else if (error.code === 11000 || error.code === 'ER_DUP_ENTRY') { // valor único duplicado
    status = 409;
    mensaje = 'Ya existe un registro con ese valor único';
  } else if (                                         // base de datos caída / sin conexión
    error.status === 503 ||
    ['MongooseServerSelectionError', 'MongoNetworkError'].includes(error.name) ||
    /buffering timed out|before initial connection/i.test(error.message) ||
    ['ECONNREFUSED', 'PROTOCOL_CONNECTION_LOST', 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR'].includes(error.code)
  ) {
    status = 503;
    mensaje = 'Base de datos no disponible. Revisa GET /api/health';
  }

  if (status === 500) console.error('💥 Error interno:', error);
  res.status(status).json({ status: 'Error', error: status === 500 ? 'Error interno del servidor' : mensaje });
};

module.exports = { rutaNoEncontrada, manejarErrores };
