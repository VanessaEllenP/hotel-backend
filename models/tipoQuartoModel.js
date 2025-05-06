const db = require('../database/connection');

const TipoQuarto = {
  listarTodos: async () => {
    const [rows] = await db.query('SELECT * FROM TIPOQUARTO');
    return rows;
  },

  buscarPorId: async (id) => {
    const [rows] = await db.query('SELECT * FROM TIPOQUARTO WHERE idTipoQuarto = ?', [id]);
    return rows;
  },

  criar: async (tipoQuarto) => {
    const sql = 'INSERT INTO TIPOQUARTO (descricao, valor) VALUES (?, ?)';
    const values = [tipoQuarto.descricao, tipoQuarto.valor];
    const [result] = await db.query(sql, values);
    return result;
  },

  atualizar: async (id, tipoQuarto) => {
    const sql = 'UPDATE TIPOQUARTO SET descricao = ?, valor = ? WHERE idTipoQuarto = ?';
    const values = [tipoQuarto.descricao, tipoQuarto.valor, id];
    const [result] = await db.query(sql, values);
    return result;
  },

  deletar: async (id) => {
    const [result] = await db.query('DELETE FROM TIPOQUARTO WHERE idTipoQuarto = ?', [id]);
    return result;
  }
};

module.exports = TipoQuarto;
