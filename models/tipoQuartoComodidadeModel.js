const db = require('../database/connection');

const TipoQuartoComodidade = {
  listarTodos: async () => {
    const [rows] = await db.query(`
      SELECT * FROM TIPOQUARTO_COMODIDADE
    `);
    return rows;
  },

  criar: async (dados) => {
    const sql = `
      INSERT INTO TIPOQUARTO_COMODIDADE (FK_TIPOQUARTO_idTipoQuarto, FK_COMODIDADE_idComodidade)
      VALUES (?, ?)
    `;
    const values = [dados.FK_TIPOQUARTO_idTipoQuarto, dados.FK_COMODIDADE_idComodidade];
    const [resultado] = await db.query(sql, values);
    return resultado;
  },

  deletar: async (idTipoQuarto, idComodidade) => {
    const sql = `
      DELETE FROM TIPOQUARTO_COMODIDADE
      WHERE FK_TIPOQUARTO_idTipoQuarto = ? AND FK_COMODIDADE_idComodidade = ?
    `;
    const [resultado] = await db.query(sql, [idTipoQuarto, idComodidade]);
    return resultado;
  },

  buscarPorTipoQuarto: async (idTipoQuarto) => {
    const [rows] = await db.query(`
      SELECT C.*
      FROM TIPOQUARTO_COMODIDADE TQC
      JOIN COMODIDADE C ON TQC.FK_COMODIDADE_idComodidade = C.idComodidade
      WHERE TQC.FK_TIPOQUARTO_idTipoQuarto = ?
    `, [idTipoQuarto]);
    return rows;
  }
};

module.exports = TipoQuartoComodidade;