const mongoose = require('mongoose');
const conectarMongo = require('./mongo');
const { conectarMySQL, obtenerPool } = require('./mysql');

// Conecta ambas bases en paralelo. Si una falla, la otra sigue funcionando.
const conectarBases = async () => {
  const [mongo, mysql] = await Promise.all([conectarMongo(), conectarMySQL()]);
  return { mongo, mysql };
};

// Hace un "ping" real a cada base y devuelve su estado (lo usa GET /api/health)
const estadoConexiones = async () => {
  const resultado = { mongodb: { estado: 'desconectado' }, mysql: { estado: 'desconectado' } };

  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      resultado.mongodb = { estado: 'conectado', base: mongoose.connection.name };
    }
  } catch (e) { resultado.mongodb = { estado: 'error', detalle: e.message }; }

  try {
    const [[fila]] = await obtenerPool().query('SELECT DATABASE() AS base, VERSION() AS version');
    resultado.mysql = { estado: 'conectado', base: fila.base, version: fila.version };
  } catch (e) {
    if (e.status !== 503) resultado.mysql = { estado: 'error', detalle: e.message };
  }
  return resultado;
};

module.exports = { conectarBases, estadoConexiones };
