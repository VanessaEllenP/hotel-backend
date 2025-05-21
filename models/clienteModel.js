const db = require('../database/connection');

const Cliente = {
  // Buscar todos os clientes
  listarTodos: async () => {
    const [rows] = await db.query('SELECT * FROM CLIENTE');
    return rows;
  },

  // Buscar um cliente por ID
  buscarPorId: async (id) => {
    const [rows] = await db.query('SELECT * FROM CLIENTE WHERE idCliente = ?', [id]);
    return rows[0];
  },

  // Buscar cliente por email (usado no login)
  buscarPorEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM CLIENTE WHERE email = ?', [email]);
    return rows[0];
  },

  // Criar novo cliente
  criar: async (cliente) => {
    const sql = `
      INSERT INTO CLIENTE (nome, sobrenome, dataNascimento, logradouro, bairro, cidade, uf, email, senha)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      cliente.nome,
      cliente.sobrenome,
      cliente.dataNascimento,
      cliente.logradouro || null,
      cliente.bairro || null,
      cliente.cidade || null,
      cliente.uf || null,
      cliente.email,
      cliente.senha
    ];
    const [resultado] = await db.query(sql, values);
    return resultado.insertId;  // <-- Retorna só o id inserido
  },

  // Atualizar cliente
  atualizar: async (id, cliente) => {
    const sql = `
      UPDATE CLIENTE SET 
        nome = ?, sobrenome = ?, dataNascimento = ?, logradouro = ?, bairro = ?, 
        cidade = ?, uf = ?, email = ?, senha = ?
      WHERE idCliente = ?`;
    const values = [
      cliente.nome,
      cliente.sobrenome,
      cliente.dataNascimento,
      cliente.logradouro || null,
      cliente.bairro || null,
      cliente.cidade || null,
      cliente.uf || null,
      cliente.email,
      cliente.senha,
      id
    ];
    const [resultado] = await db.query(sql, values);
    return resultado;
  },

  // Deletar cliente
  deletar: async (id) => {
    const [resultado] = await db.query('DELETE FROM CLIENTE WHERE idCliente = ?', [id]);
    return resultado;
  }
};

module.exports = Cliente;
