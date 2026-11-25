// Error con código HTTP, lanzado por los services y traducido por el middleware de errores
class ErrorApp extends Error {
  constructor(mensaje, status = 500) {
    super(mensaje);
    this.status = status;
  }
}

module.exports = ErrorApp;
