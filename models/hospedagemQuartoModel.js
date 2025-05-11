const db = require('../database/connection');

const HospedagemQuarto = {
    listarTodos: async () => {
        const [rows] = await db.query(`
          SELECT 
            HQ.FK_HOSPEDAGEM_idHospedagem AS idHospedagem,
            HQ.FK_QUARTO_idQuarto AS idQuarto,
            Q.nomeQuarto,
            TQ.descricao AS tipoQuarto
          FROM HOSPEDAGEM_QUARTO HQ
          JOIN QUARTO Q ON HQ.FK_QUARTO_idQuarto = Q.idQuarto
          JOIN TIPOQUARTO TQ ON Q.FK_TIPOQUARTO_idTipoQuarto = TQ.idTipoQuarto
        `);
        return rows;
      
  },

  criar: async (dados) => {
    const sql = `
      INSERT INTO HOSPEDAGEM_QUARTO (FK_HOSPEDAGEM_idHospedagem, FK_QUARTO_idQuarto)
      VALUES (?, ?)`;
    const values = [dados.FK_HOSPEDAGEM_idHospedagem, dados.FK_QUARTO_idQuarto];
    const [resultado] = await db.query(sql, values);
    return resultado;
  },

  deletar: async (idHospedagem, idQuarto) => {
    const sql = `
      DELETE FROM HOSPEDAGEM_QUARTO
      WHERE FK_HOSPEDAGEM_idHospedagem = ? AND FK_QUARTO_idQuarto = ?`;
    const [resultado] = await db.query(sql, [idHospedagem, idQuarto]);
    return resultado;
  },

  buscarPorHospedagem: async (idHospedagem) => {
    const [rows] = await db.query(`
      SELECT Q.*
      FROM HOSPEDAGEM_QUARTO HQ
      JOIN QUARTO Q ON HQ.FK_QUARTO_idQuarto = Q.idQuarto
      WHERE HQ.FK_HOSPEDAGEM_idHospedagem = ?
    `, [idHospedagem]);
    return rows;
  }
};

module.exports = HospedagemQuarto;
