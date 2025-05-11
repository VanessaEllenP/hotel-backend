require('dotenv').config(); // Garante acesso às variáveis do .env
const jwt = require('jsonwebtoken');
const segredo = process.env.JWT_SECRET;

const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  jwt.verify(token, segredo, (err, cliente) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido' });
    }

    req.cliente = cliente; // Adiciona os dados do token à requisição
    next();
  });
};

module.exports = autenticarToken;
