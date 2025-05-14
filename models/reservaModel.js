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

  // NOVO: Buscar reservas por cliente
  getByClienteId: async (clienteId) => {
    const [rows] = await db.query('SELECT * FROM RESERVA WHERE FK_CLIENTE_idCliente = ?', [clienteId]);
    return rows;
  },

  create: async (novaReserva) => {
    // Calcular o valor total usando a função SimularValorReserva
    const [resultado] = await db.query(`
      SELECT SimularValorReserva(?, ?, ?) AS valorTotal
    `, [novaReserva.FK_TIPOQUARTO_idTipoQuarto, novaReserva.dtInicial, novaReserva.dtFinal]);

    const valorTotal = resultado.valorTotal;

    // Inserir a nova reserva com o valor total calculado
    const sql = `
      INSERT INTO RESERVA 
        (dtInicial, dtFinal, statusReserva, FK_CLIENTE_idCliente, FK_TIPOQUARTO_idTipoQuarto, valorTotal) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      novaReserva.dtInicial,
      novaReserva.dtFinal,
      novaReserva.statusReserva || 'PENDENTE',
      novaReserva.FK_CLIENTE_idCliente,
      novaReserva.FK_TIPOQUARTO_idTipoQuarto,
      valorTotal
    ];
    const [result] = await db.query(sql, values);
    return result;
  },

  update: async (id, reservaAtualizada) => {
    // Calcular o valor total usando a função SimularValorReserva
    const [resultado] = await db.query(`
      SELECT SimularValorReserva(?, ?, ?) AS valorTotal
    `, [reservaAtualizada.FK_TIPOQUARTO_idTipoQuarto, reservaAtualizada.dtInicial, reservaAtualizada.dtFinal]);

    const valorTotal = resultado.valorTotal;

    // Atualizar a reserva com o valor total calculado
    const sql = `
      UPDATE RESERVA 
      SET dtInicial = ?, dtFinal = ?, statusReserva = ?, 
          FK_CLIENTE_idCliente = ?, FK_TIPOQUARTO_idTipoQuarto = ?, valorTotal = ? 
      WHERE idReserva = ?
    `;
    const values = [
      reservaAtualizada.dtInicial,
      reservaAtualizada.dtFinal,
      reservaAtualizada.statusReserva,
      reservaAtualizada.FK_CLIENTE_idCliente,
      reservaAtualizada.FK_TIPOQUARTO_idTipoQuarto,
      valorTotal,
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
