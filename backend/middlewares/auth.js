const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.sesion_empleado;

  if (!token) {
    return res.status(401).json({ error: 'No autenticado, credenciales no proporcionadas' });
  }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = token; 
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Algo salio mal' });
  }
};

module.exports = { verifyToken };