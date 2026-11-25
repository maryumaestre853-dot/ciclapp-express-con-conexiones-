const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const ErrorApp = require('./errores');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.registrar = async ({ nombre, email, password }) => {
  if (!nombre || !email || !password) {
    throw new ErrorApp('nombre, email y password son obligatorios', 400);
  }
  if (!EMAIL_REGEX.test(email)) throw new ErrorApp('El email no tiene un formato válido', 400);
  if (String(password).length < 6) {
    throw new ErrorApp('La contraseña debe tener mínimo 6 caracteres', 400);
  }
  // Regla de negocio: la contraseña se guarda encriptada, nunca en texto plano
  const passwordHash = await bcrypt.hash(String(password), 10);
  try {
    await Usuario.crear({
      nombre: String(nombre).trim(),
      email: String(email).toLowerCase().trim(),
      password: passwordHash
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') throw new ErrorApp('El email ya está registrado', 409);
    throw error;
  }
};

exports.login = async ({ email, password }) => {
  if (!email || !password) throw new ErrorApp('Email y contraseña son obligatorios', 400);

  const usuario = await Usuario.buscarPorEmail(String(email).toLowerCase().trim());
  const coincide = usuario ? await bcrypt.compare(String(password), usuario.password) : false;
  if (!coincide) throw new ErrorApp('Credenciales inválidas', 401);

  return {
    token: 'mock-jwt-token-adso-2026', // Token simulado según la guía de apoyo
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
  };
};

exports.listar = () => Usuario.listar(); // Ya excluye la contraseña
