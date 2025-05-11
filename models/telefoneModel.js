const db = require('../database/connection');

const Telefone = {
  listarTodos: async () => {
    const [rows] = await db.query('SELECT * FROM TELEFONE');
    return rows;
  },

  buscarPorId: async (id) => {
    const [rows] = await db.query('SELECT * FROM TELEFONE WHERE idTelefone = ?', [id]);
    return rows[0];
  },

  criar: async (dados) => {
    const sql = `
      INSERT INTO TELEFONE (numero, FK_CLIENTE_idCliente)
      VALUES (?, ?)
    `;
    const values = [dados.numero, dados.FK_CLIENTE_idCliente];
    const [resultado] = await db.query(sql, values);
    return resultado.insertId;
  },

  atualizar: async (id, dados) => {
    const sql = `
      UPDATE TELEFONE SET numero = ?, FK_CLIENTE_idCliente = ?
      WHERE idTelefone = ?
    `;
    const values = [dados.numero, dados.FK_CLIENTE_idCliente, id];
    const [resultado] = await db.query(sql, values);
    return resultado;
  },

  deletar: async (id) => {
    const [resultado] = await db.query('DELETE FROM TELEFONE WHERE idTelefone = ?', [id]);
    return resultado;
  }
};

module.exports = Telefone;
