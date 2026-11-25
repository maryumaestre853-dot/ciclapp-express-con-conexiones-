require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { conectarBases } = require('./config/db');
const logger = require('./middlewares/logger');
const { rutaNoEncontrada, manejarErrores } = require('./middlewares/errorHandler');

const app = express();

// 1. Middlewares globales (el orden importa)
app.use(cors());
app.use(express.json()); // Parsea cuerpos JSON en req.body
app.use(logger);         // Registra cada petición

// 2. Rutas de la API
app.get('/', (req, res) => res.json({ status: 'OK', message: 'API CiclApp funcionando 🚴' }));
app.use('/api/health', require('./routes/healthRoutes'));      // prueba de conexiones
app.use('/api/productos', require('./routes/productoRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/reportes', require('./routes/reporteRoutes'));

// 3. Middlewares finales: ruta no encontrada y manejo central de errores
app.use(rutaNoEncontrada);
app.use(manejarErrores);

// 4. Conectar a la BD y levantar el servidor (solo si se ejecuta con "npm start")
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
  });
  conectarBases(); // MongoDB + MySQL (si una falla, se informa en consola y en /api/health)
}

module.exports = app;
