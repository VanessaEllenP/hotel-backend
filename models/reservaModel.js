const db = require('../database/connection');

const Reserva = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM RESERVA');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM RESERVA WHERE idReserva = ?', [id]);
    return rows;
  },

  create: async (novaReserva) => {
    const sql = `
      INSERT INTO RESERVA 
        (dtInicial, dtFinal, statusReserva, FK_CLIENTE_idCliente, FK_TIPOQUARTO_idTipoQuarto) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      novaReserva.dtInicial,
      novaReserva.dtFinal,
      novaReserva.statusReserva || 'PENDENTE',
      novaReserva.FK_CLIENTE_idCliente,
      novaReserva.FK_TIPOQUARTO_idTipoQuarto
    ];
    const [result] = await db.query(sql, values);
    return result;
  },

  update: async (id, reservaAtualizada) => {
    const sql = `
      UPDATE RESERVA 
      SET dtInicial = ?, dtFinal = ?, statusReserva = ?, 
          FK_CLIENTE_idCliente = ?, FK_TIPOQUARTO_idTipoQuarto = ? 
      WHERE idReserva = ?
    `;
    const values = [
      reservaAtualizada.dtInicial,
      reservaAtualizada.dtFinal,
      reservaAtualizada.statusReserva,
      reservaAtualizada.FK_CLIENTE_idCliente,
      reservaAtualizada.FK_TIPOQUARTO_idTipoQuarto,
      id
    ];
    const [result] = await db.query(sql, values);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM RESERVA WHERE idReserva = ?', [id]);
    return result;
  }
};

module.exports = Reserva;
