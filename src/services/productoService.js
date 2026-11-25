const Producto = require('../models/Producto');
const ErrorApp = require('./errores');

const CAMPOS = ['nombre', 'descripcion', 'precio', 'stock', 'categoria'];

// Reglas de negocio de un producto
const validarDatos = (datos, completo = true) => {
  if (completo && (!datos.nombre || datos.precio === undefined || !datos.categoria)) {
    throw new ErrorApp('nombre, precio y categoria son obligatorios', 400);
  }
  if (datos.precio !== undefined && (typeof datos.precio !== 'number' || !(datos.precio >= 0))) {
    throw new ErrorApp('El precio debe ser un número mayor o igual a 0', 400);
  }
  if (datos.stock !== undefined && (!Number.isInteger(datos.stock) || datos.stock < 0)) {
    throw new ErrorApp('El stock debe ser un entero mayor o igual a 0', 400);
  }
};

const soloCampos = (datos) => Object.fromEntries(CAMPOS.filter((c) => c in datos).map((c) => [c, datos[c]]));

exports.crear = async (datos) => {
  validarDatos(datos);
  return Producto.create(soloCampos(datos));
};

exports.listar = () => Producto.find().sort({ fechaRegistro: -1 });

exports.obtenerPorId = async (id) => {
  const producto = await Producto.findById(id);
  if (!producto) throw new ErrorApp('Producto no encontrado', 404);
  return producto;
};

// PUT = actualización TOTAL: reemplaza todos los campos (los que no se envían se limpian)
exports.actualizar = async (id, datos) => {
  validarDatos(datos);
  const producto = await Producto.findById(id);
  if (!producto) throw new ErrorApp('Producto no encontrado', 404);
  const nuevos = soloCampos(datos);
  CAMPOS.forEach((c) => { producto[c] = nuevos[c]; });
  if (producto.stock === undefined) producto.stock = 0; // valor por defecto del stock
  return producto.save(); // ejecuta los validadores del esquema
};

exports.eliminar = async (id) => {
  const eliminado = await Producto.findByIdAndDelete(id);
  if (!eliminado) throw new ErrorApp('Producto no encontrado', 404);
  return eliminado;
};

// Coincidencia exacta de categoría sin distinguir mayúsculas ("Frenos" = "frenos")
const escaparRegex = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
exports.filtrarPorCategoria = (cat) => {
  const texto = String(cat).trim();
  if (!texto) throw new ErrorApp('La categoría no puede estar vacía', 400);
  return Producto.find({ categoria: new RegExp(`^${escaparRegex(texto)}$`, 'i') }).sort({ fechaRegistro: -1 });
};
