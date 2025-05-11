const db = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();  // Carrega variáveis de ambiente do arquivo .env

const segredoJWT = process.env.JWT_SECRET || 'seusegredoseguro'; // A variável de ambiente do segredo JWT

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
  }

  try {
    // Buscar cliente pelo email
    const [clientes] = await db.query('SELECT * FROM CLIENTE WHERE email = ?', [email]);

    if (clientes.length === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    const cliente = clientes[0];

    // Comparar senha informada com a hash armazenada
    const senhaCorreta = await bcrypt.compare(senha, cliente.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha inválida' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: cliente.idCliente, email: cliente.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );    

    res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      cliente: {
        id: cliente.idCliente,
        nome: cliente.nome,
        email: cliente.email
      }
    });

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao realizar login', detalhes: err.message });
  }
};
