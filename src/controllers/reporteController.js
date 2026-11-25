const service = require('../services/reporteService');

// 10. GET /api/reportes/estadisticas
exports.obtenerEstadisticas = async (req, res, next) => {
  try {
    const data = await service.estadisticas();
    res.status(200).json({ status: 'OK', data });
  } catch (error) { next(error); }
};
