// Uso: npm run probar-db
// Prueba las dos conexiones SIN levantar el servidor y muestra el resultado.
require('dotenv').config();
const mongoose = require('mongoose');
const conectarMongo = require('../config/mongo');
const { conectarMySQL, obtenerPool } = require('../config/mysql');

(async () => {
  console.log('--- Probando conexiones ---');
  const [mongoOk, mysqlOk] = await Promise.all([conectarMongo(), conectarMySQL()]);

  if (mongoOk) {
    const info = await mongoose.connection.db.admin().serverInfo();
    console.log(`   MongoDB versión ${info.version}`);
  }
  if (mysqlOk) {
    const [[fila]] = await obtenerPool().query('SELECT VERSION() AS version');
    console.log(`   MySQL versión ${fila.version}`);
  }

  console.log('--- Resultado ---');
  console.log(`MongoDB: ${mongoOk ? 'OK ✅' : 'FALLÓ ❌'}`);
  console.log(`MySQL:   ${mysqlOk ? 'OK ✅' : 'FALLÓ ❌'}`);

  await mongoose.disconnect().catch(() => {});
  if (mysqlOk) await obtenerPool().end();
  process.exit(mongoOk && mysqlOk ? 0 : 1);
})();
