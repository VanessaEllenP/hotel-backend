const db = require('../database/connection');

const Quarto = {
  // Listar todos os quartos
  async getAll() {
    const [rows] = await db.query('SELECT * FROM QUARTO');
    return rows;
  },

  // Buscar quarto por ID
  async getById(id) {
    const [rows] = await db.query('SELECT * FROM QUARTO WHERE idQuarto = ?', [id]);
    return rows;
  },

  // Listar quartos com os dados do tipo do quarto (descrição e valor)
  async getQuartosComTipo() {
    const sql = `
      SELECT 
        q.idQuarto AS idQuarto,
        q.nomeQuarto AS numero,
        t.idTipoQuarto AS idTipoQuarto,
        t.descricao AS tipoDescricao,
        t.precoNoite AS tipoValor
      FROM QUARTO q
      JOIN TIPOQUARTO t ON q.FK_TIPOQUARTO_idTipoQuarto = t.idTipoQuarto
      ORDER BY q.idQuarto
    `;
    const [rows] = await db.query(sql);
    return rows;
  },

  // Buscar detalhes de um quarto por ID, incluindo comodidades
  async getDetalhesPorId(id) {
    const sqlQuarto = `
      SELECT 
        q.idQuarto,
        q.nomeQuarto,
        t.idTipoQuarto,
        t.descricao AS tipoDescricao,
        t.precoNoite
      FROM QUARTO q
      JOIN TIPOQUARTO t ON q.FK_TIPOQUARTO_idTipoQuarto = t.idTipoQuarto
      WHERE q.idQuarto = ?
    `;

    const [quartoRows] = await db.query(sqlQuarto, [id]);
    if (quartoRows.length === 0) return null;

    const sqlComodidades = `
      SELECT c.descricao 
      FROM COMODIDADE c
      JOIN TIPOQUARTO_COMODIDADE tc ON tc.FK_COMODIDADE_idComodidade = c.idComodidade
      WHERE tc.FK_TIPOQUARTO_idTipoQuarto = ?
    `;
    const [comodidadeRows] = await db.query(sqlComodidades, [quartoRows[0].idTipoQuarto]);

    return {
      ...quartoRows[0],
      comodidades: comodidadeRows.map(c => c.descricao)
    };
  },

  // Criar novo quarto
  async create(quarto) {
    const sql = 'INSERT INTO QUARTO (nomeQuarto, FK_TIPOQUARTO_idTipoQuarto) VALUES (?, ?)';
    const values = [
      quarto.nomeQuarto,
      quarto.FK_TIPOQUARTO_idTipoQuarto
    ];
    const [result] = await db.query(sql, values);
    return result;
  },

  // Atualizar quarto
  async update(id, quarto) {
    const sql = 'UPDATE QUARTO SET nomeQuarto = ?, FK_TIPOQUARTO_idTipoQuarto = ? WHERE idQuarto = ?';
    const values = [
      quarto.nomeQuarto,
      quarto.FK_TIPOQUARTO_idTipoQuarto,
      id
    ];
    const [result] = await db.query(sql, values);
    return result;
  },

  // Deletar quarto
  async delete(id) {
    const [result] = await db.query('DELETE FROM QUARTO WHERE idQuarto = ?', [id]);
    return result;
  },
};

module.exports = Quarto;
