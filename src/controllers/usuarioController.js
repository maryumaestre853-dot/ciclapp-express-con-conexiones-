const service = require('../services/usuarioService');

// 7. POST /api/usuarios/registro
exports.registrarUsuario = async (req, res, next) => {
  try {
    await service.registrar(req.body);
    res.status(201).json({ status: 'OK', message: 'Usuario registrado exitosamente' });
  } catch (error) { next(error); }
};

// 8. POST /api/usuarios/login
exports.loginUsuario = async (req, res, next) => {
  try {
    const { token, usuario } = await service.login(req.body);
    res.status(200).json({ status: 'OK', token, usuario });
  } catch (error) { next(error); }
};

// 9. GET /api/usuarios
exports.listarUsuarios = async (req, res, next) => {
  try {
    const data = await service.listar();
    res.status(200).json({ status: 'OK', total: data.length, data });
  } catch (error) { next(error); }
};
