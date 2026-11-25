const { obtenerPool } = require('../config/mysql');

// Modelo de usuarios sobre MySQL: solo accede a la base de datos, sin reglas de negocio.
exports.crear = async ({ nombre, email, password }) => {
  const [r] = await obtenerPool().execute(
    'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
    [nombre, email, password]
  );
  return r.insertId;
};

exports.buscarPorEmail = async (email) => {
  const [filas] = await obtenerPool().execute('SELECT * FROM usuarios WHERE email = ?', [email]);
  return filas[0] || null;
};

// Nunca devuelve la contraseña
exports.listar = async () => {
  const [filas] = await obtenerPool().query(
    'SELECT id, nombre, email, fecha_creacion AS fechaCreacion FROM usuarios ORDER BY id'
  );
  return filas;
};

exports.contar = async () => {
  const [[fila]] = await obtenerPool().query('SELECT COUNT(*) AS total FROM usuarios');
  return fila.total;
};
