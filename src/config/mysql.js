const mysql = require('mysql2/promise');

let pool = null;

const configuracion = () => ({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || ''
});
const nombreBD = () => process.env.MYSQL_DATABASE || 'ciclapp_db';

// Conecta a MySQL, crea la base y la tabla "usuarios" si no existen. Devuelve true/false.
const conectarMySQL = async () => {
  try {
    // 1) Conexión sin base de datos, solo para poder crearla si no existe
    const inicial = await mysql.createConnection({ ...configuracion(), connectTimeout: 5000 });
    await inicial.query(`CREATE DATABASE IF NOT EXISTS \`${nombreBD()}\` CHARACTER SET utf8mb4`);
    await inicial.end();

    // 2) Pool de conexiones que usará toda la app
    pool = mysql.createPool({ ...configuracion(), database: nombreBD(), waitForConnections: true, connectionLimit: 10 });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log(`✅ MySQL conectado (base: ${nombreBD()}, tabla: usuarios)`);
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error.message);
    pool = null;
    return false;
  }
};

// Los models usan esta función para ejecutar consultas
const obtenerPool = () => {
  if (!pool) {
    const error = new Error('MySQL no está conectado');
    error.status = 503;
    throw error;
  }
  return pool;
};

module.exports = { conectarMySQL, obtenerPool };
