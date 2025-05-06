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

  // Criar novo quarto
  async create(quarto) {
    const sql = 'INSERT INTO QUARTO (numero, andar, statusQuarto, FK_TIPOQUARTO_idTipoQuarto) VALUES (?, ?, ?, ?)';
    const values = [
      quarto.numero,
      quarto.andar,
      quarto.statusQuarto || 'DISPONIVEL',
      quarto.FK_TIPOQUARTO_idTipoQuarto
    ];
    const [result] = await db.query(sql, values);
    return result;
  },

  // Atualizar quarto
  async update(id, quarto) {
    const sql = 'UPDATE QUARTO SET numero = ?, andar = ?, statusQuarto = ?, FK_TIPOQUARTO_idTipoQuarto = ? WHERE idQuarto = ?';
    const values = [
      quarto.numero,
      quarto.andar,
      quarto.statusQuarto,
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
  }
};

module.exports = Quarto;
