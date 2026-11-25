const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');

// Combina datos de las dos bases: productos (MongoDB) y usuarios (MySQL)
exports.estadisticas = async () => {
  const [totalProductos, productosPorCategoria, resumenInventario, totalUsuarios] = await Promise.all([
    Producto.countDocuments(),
    Producto.aggregate([
      { $group: { _id: '$categoria', totalProductos: { $sum: 1 }, stockTotal: { $sum: '$stock' } } },
      { $sort: { totalProductos: -1 } },
      { $project: { _id: 0, categoria: '$_id', totalProductos: 1, stockTotal: 1 } }
    ]),
    Producto.aggregate([
      { $group: {
          _id: null,
          valorInventario: { $sum: { $multiply: ['$precio', '$stock'] } },
          precioPromedio: { $avg: '$precio' },
          sinStock: { $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] } }
      } }
    ]),
    Usuario.contar()
  ]);

  const r = resumenInventario[0] || {};
  return {
    totalProductos,
    totalUsuarios,
    valorInventario: r.valorInventario || 0,
    precioPromedio: r.precioPromedio ? Math.round(r.precioPromedio * 100) / 100 : 0,
    productosSinStock: r.sinStock || 0,
    productosPorCategoria
  };
};
