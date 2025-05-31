const db = require('../database/connection');
const bcrypt = require('bcrypt');

const Cliente = {
  // Buscar todos os clientes
  listarTodos: async () => {
    const [rows] = await db.query('SELECT * FROM CLIENTE');
    return rows;
  },

  // Buscar um cliente por ID
  buscarPorId: async (id) => {
    const [rows] = await db.query(
      `SELECT idCliente, nome, sobrenome, dataNascimento, logradouro, bairro, cidade, uf, cep, numero, complemento, email 
       FROM CLIENTE WHERE idCliente = ?`,
      [id]
    );
    return rows[0];
  },

  // Buscar cliente por email (usado no login)
  buscarPorEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM CLIENTE WHERE email = ?', [email]);
    return rows[0];
  },

  // Buscar cliente por ID ou email (retorna a senha também)
  buscarPorEmailOuId: async (identificador) => {
    let sql = '';
    if (typeof identificador === 'number') {
      sql = 'SELECT * FROM CLIENTE WHERE idCliente = ?';
    } else {
      sql = 'SELECT * FROM CLIENTE WHERE email = ?';
    }
    const [rows] = await db.query(sql, [identificador]);
    return rows[0];
  },

  // Criar novo cliente
  criar: async (cliente) => {
    const senhaCriptografada = await bcrypt.hash(cliente.senha, 10);
    const sql = `
      INSERT INTO CLIENTE (nome, sobrenome, dataNascimento, logradouro, bairro, cidade, uf, cep, numero, complemento, email, senha)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      cliente.nome,
      cliente.sobrenome,
      cliente.dataNascimento,
      cliente.logradouro || null,
      cliente.bairro || null,
      cliente.cidade || null,
      cliente.uf || null,
      cliente.cep || null,
      cliente.numero || null,
      cliente.complemento || null,
      cliente.email,
      senhaCriptografada
    ];
    const [resultado] = await db.query(sql, values);
    return resultado.insertId;
  },

  // Atualizar cliente (sem alterar a senha se não for enviada)
  atualizar: async (id, cliente) => {
    let email = cliente.email;
    if (!email) {
      const clienteAtual = await Cliente.buscarPorId(id);
      if (!clienteAtual) throw new Error('Cliente não encontrado para atualização');
      email = clienteAtual.email;
    }

    let sql = `
      UPDATE CLIENTE SET 
        nome = ?, sobrenome = ?, dataNascimento = ?, logradouro = ?, bairro = ?, 
        cidade = ?, uf = ?, cep = ?, numero = ?, complemento = ?, email = ?`;

    const values = [
      cliente.nome,
      cliente.sobrenome,
      cliente.dataNascimento,
      cliente.logradouro || null,
      cliente.bairro || null,
      cliente.cidade || null,
      cliente.uf || null,
      cliente.cep || null,
      cliente.numero || null,
      cliente.complemento || null,
      email
    ];

    if (cliente.senha) {
      const senhaHash = await bcrypt.hash(cliente.senha, 10);
      sql += `, senha = ?`;
      values.push(senhaHash);
    }

    sql += ` WHERE idCliente = ?`;
    values.push(id);

    const [resultado] = await db.query(sql, values);
    return resultado;
  },

  // Atualizar somente o email do cliente
  atualizarEmail: async (id, email) => {
    const sql = `UPDATE CLIENTE SET email = ? WHERE idCliente = ?`;
    const values = [email, id];
    const [resultado] = await db.query(sql, values);
    return resultado;
  },

  // Atualizar somente a senha do cliente (sem checar senha atual)
  atualizarSenha: async (id, senha) => {
    const senhaHash = await bcrypt.hash(senha, 10);
    const sql = `UPDATE CLIENTE SET senha = ? WHERE idCliente = ?`;
    const values = [senhaHash, id];
    const [resultado] = await db.query(sql, values);
    return resultado;
  },

  // Alterar a senha com verificação da senha atual
  alterarSenhaComVerificacao: async (id, senhaAtualDigitada, novaSenha) => {
    const cliente = await Cliente.buscarPorEmailOuId(id);
    if (!cliente) throw new Error('Cliente não encontrado');

    const senhaCorreta = await bcrypt.compare(senhaAtualDigitada, cliente.senha);
    if (!senhaCorreta) throw new Error('Senha atual incorreta');

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
    const sql = `UPDATE CLIENTE SET senha = ? WHERE idCliente = ?`;
    const [resultado] = await db.query(sql, [novaSenhaHash, id]);
    return resultado;
  },

  // Deletar cliente
  deletar: async (id) => {
    const [resultado] = await db.query('DELETE FROM CLIENTE WHERE idCliente = ?', [id]);
    return resultado;
  }
};

module.exports = Cliente;
