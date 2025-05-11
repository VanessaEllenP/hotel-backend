const db = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const segredoJWT = 'seusegredoseguro'; // você pode mover isso para uma variável de ambiente depois

exports.login = async (req, res) => {
  const { email, senha } = req.body;

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
      segredoJWT,
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
    res.status(500).json({ erro: 'Erro ao realizar login' });
  }
};
