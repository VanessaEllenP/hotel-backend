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

  // Buscar reservas por cliente
  getByClienteId: async (clienteId) => {
    const [rows] = await db.query('SELECT * FROM RESERVA WHERE FK_CLIENTE_idCliente = ?', [clienteId]);
    return rows;
  },

  create: async (novaReserva) => {
    // Calcular o valor total usando a função SimularValorReserva
    const [resultado] = await db.query(`
      SELECT SimularValorReserva(?, ?, ?) AS valorTotal
    `, [novaReserva.FK_TIPOQUARTO_idTipoQuarto, novaReserva.dtInicial, novaReserva.dtFinal]);

    const valorTotal = resultado[0].valorTotal;

    // Inserir a nova reserva com o valor total calculado e quantidade de pessoas
    const sql = `
      INSERT INTO RESERVA 
        (dtInicial, dtFinal, qntPessoas, statusReserva, FK_CLIENTE_idCliente, FK_TIPOQUARTO_idTipoQuarto, valorTotal) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      novaReserva.dtInicial,
      novaReserva.dtFinal,
      novaReserva.qntPessoas || 1,  // valor padrão 1 se não informado
      novaReserva.statusReserva || 'PENDENTE',
      novaReserva.FK_CLIENTE_idCliente,
      novaReserva.FK_TIPOQUARTO_idTipoQuarto,
      valorTotal
    ];
    const [result] = await db.query(sql, values);
    return result;
  },

update: async (id, reservaAtualizada) => {
  if (reservaAtualizada.statusReserva === 'CONFIRMADA') {
    // Chamar a stored procedure que confirma a reserva e cria a hospedagem
    const [result] = await db.query(`CALL ConfirmarReservaECriarHospedagem(?)`, [id]);
    return result;
  } else {
    // Atualização comum se não for CONFIRMAÇÃO
    const [resultado] = await db.query(`
      SELECT SimularValorReserva(?, ?, ?) AS valorTotal
    `, [reservaAtualizada.FK_TIPOQUARTO_idTipoQuarto, reservaAtualizada.dtInicial, reservaAtualizada.dtFinal]);

    const valorTotal = resultado[0].valorTotal;

    const sql = `
      UPDATE RESERVA 
      SET dtInicial = ?, dtFinal = ?, qntPessoas = ?, statusReserva = ?, 
          FK_CLIENTE_idCliente = ?, FK_TIPOQUARTO_idTipoQuarto = ?, valorTotal = ? 
      WHERE idReserva = ?
    `;
    const values = [
      reservaAtualizada.dtInicial,
      reservaAtualizada.dtFinal,
      reservaAtualizada.qntPessoas || 1,
      reservaAtualizada.statusReserva,
      reservaAtualizada.FK_CLIENTE_idCliente,
      reservaAtualizada.FK_TIPOQUARTO_idTipoQuarto,
      valorTotal,
      id
    ];
    const [result] = await db.query(sql, values);
    return result;
  }
},

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM RESERVA WHERE idReserva = ?', [id]);
    return result;
  },

  simularValor: async (idTipoQuarto, checkIn, checkOut) => {
    const [resultado] = await db.query(
      `SELECT SimularValorReserva(?, ?, ?) AS valorTotal`,
      [idTipoQuarto, checkIn, checkOut]
    );
    return resultado;
  }

};

module.exports = Reserva;
