const mongoose = require('mongoose');

// Conexión asíncrona a MongoDB. Devuelve true/false (no tumba la app para poder diagnosticar).
const conectarMongo = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ciclapp_db';
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ MongoDB conectado (base: ${mongoose.connection.name})`);
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    return false;
  }
};

module.exports = conectarMongo;
