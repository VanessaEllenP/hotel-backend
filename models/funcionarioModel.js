const db = require('../database/connection');

const Funcionario = {
  listarTodos: async () => {
    const [rows] = await db.query('SELECT * FROM FUNCIONARIO');
    return rows;
  },

  buscarPorId: async (id) => {
    const [rows] = await db.query('SELECT * FROM FUNCIONARIO WHERE idFuncionario = ?', [id]);
    return rows[0];
  },

  criar: async (dados) => {
    const sql = 'INSERT INTO FUNCIONARIO (nome, email, cargo) VALUES (?, ?, ?)';
    const values = [dados.nome, dados.email, dados.cargo];
    const [resultado] = await db.query(sql, values);
    return resultado;
  },

  atualizar: async (id, dados) => {
    const sql = 'UPDATE FUNCIONARIO SET nome = ?, email = ?, cargo = ? WHERE idFuncionario = ?';
    const values = [dados.nome, dados.email, dados.cargo, id];
    const [resultado] = await db.query(sql, values);
    return resultado;
  },

  deletar: async (id) => {
    const sql = 'DELETE FROM FUNCIONARIO WHERE idFuncionario = ?';
    const [resultado] = await db.query(sql, [id]);
    return resultado;
  }
};

module.exports = Funcionario;
