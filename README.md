# CiclApp API – Express + MongoDB + MySQL (SENA ADSO)

API REST con Node.js y Express. **10 endpoints** sobre productos, usuarios y reportes, usando dos bases de datos:

| Datos | Base de datos | Acceso |
|---|---|---|
| Productos y reportes | **MongoDB** | Mongoose |
| Usuarios (registro / login) | **MySQL** | mysql2 (pool) |

## Instalación
```bash
npm install
cp .env.example .env     # en Windows: copy .env.example .env
```
Edita `.env` con tus datos (sobre todo `MYSQL_USER` y `MYSQL_PASSWORD`). La base `ciclapp_db` y la tabla `usuarios` de MySQL **se crean solas** al arrancar.

## Cómo probar las conexiones

**1. Sin levantar el servidor**
```bash
npm run probar-db
```
Salida esperada:
```
✅ MongoDB conectado (base: ciclapp_db)
✅ MySQL conectado (base: ciclapp_db, tabla: usuarios)
MongoDB: OK ✅
MySQL:   OK ✅
```

**2. Con el servidor** (`npm start`) abre en el navegador o Postman:
```
GET http://localhost:5000/api/health
```
Responde 200 si ambas bases responden; 503 indicando cuál falló.

**3. Prueba completa:** importa `CiclApp_Coleccion_Postman.json` y ejecuta los requests en orden. Registrar/login/listar usuarios prueba **MySQL**; crear/listar productos y estadísticas prueba **MongoDB**.

### Errores típicos
| Mensaje | Causa |
|---|---|
| `connect ECONNREFUSED 127.0.0.1:27017` | MongoDB no está corriendo (inicia el servicio `mongod`) |
| `connect ECONNREFUSED 127.0.0.1:3306` | MySQL no está corriendo (inicia MySQL / XAMPP / Workbench) |
| `Access denied for user ...` | `MYSQL_USER` / `MYSQL_PASSWORD` incorrectos en `.env` |

## Endpoints
| # | Método | Ruta | Descripción |
|---|--------|------|-------------|
| 1 | POST   | /api/productos | Crear un nuevo producto |
| 2 | GET    | /api/productos | Listado completo de productos |
| 3 | GET    | /api/productos/:id | Detalle de un producto por ID |
| 4 | PUT    | /api/productos/:id | Actualización total de un producto |
| 5 | DELETE | /api/productos/:id | Eliminar un producto |
| 6 | GET    | /api/productos/categoria/:cat | Filtrar productos por categoría |
| 7 | POST   | /api/usuarios/registro | Registrar un usuario |
| 8 | POST   | /api/usuarios/login | Autenticación de usuario |
| 9 | GET    | /api/usuarios | Consultar usuarios registrados |
| 10 | GET   | /api/reportes/estadisticas | Métricas agregadas (conteos y agregaciones) |
| – | GET    | /api/health | Estado de las conexiones a MongoDB y MySQL |

Cuerpo de un producto: `{ "nombre", "precio", "categoria"` (obligatorios)`, "descripcion", "stock" }`.

## Estructura (flujo unidireccional)
```
Cliente HTTP → Routes → Controllers → Services → Models → BD

src/
├── routes/        Rutas HTTP → controlador (sin lógica de negocio)
├── controllers/   Extraen datos de la petición y fijan códigos HTTP
├── services/      Validaciones y reglas de negocio (no conocen req ni res)
├── models/        Producto (Mongoose/MongoDB) · Usuario (consultas MySQL)
├── middlewares/   logger, validarId, validarCuerpo, errorHandler
├── config/        mongo.js · mysql.js · db.js (conecta ambas y reporta estado)
├── scripts/       probarConexiones.js (npm run probar-db)
└── app.js         Punto de entrada
```

## Reglas de negocio (capa services)
- Producto: `nombre`, `precio` (≥ 0) y `categoria` obligatorios; `stock` entero ≥ 0 (por defecto 0).
- PUT reemplaza todos los campos del producto (los no enviados se limpian).
- Filtro por categoría sin distinguir mayúsculas.
- Usuario: contraseña mínimo 6 caracteres, guardada con bcrypt; email válido y único (409).
- Login devuelve un token simulado, según la guía de apoyo.
- Si una base está caída, los endpoints que la usan responden 503 (la otra sigue funcionando).
