const db = require('../database/connection');

const Hospedagem = {
  // Listar todas as hospedagens com dados da reserva e cliente
  listarTodos: async () => {
    const [rows] = await db.query(`
      SELECT 
        h.idHospedagem,
        h.statusHospedagem,
        h.valorExtra,
        h.FK_CLIENTE_idCliente,
        h.FK_FUNCIONARIO_idFuncionario,
        h.FK_RESERVA_idReserva,
        r.dtInicial AS dtEntrada,
        r.dtFinal AS dtSaida,
        r.valorTotal,
        (r.valorTotal + h.valorExtra) AS valorFinalHospedagem,
        c.nome AS nomeCliente
      FROM HOSPEDAGEM h
      INNER JOIN RESERVA r ON h.FK_RESERVA_idReserva = r.idReserva
      INNER JOIN CLIENTE c ON h.FK_CLIENTE_idCliente = c.idCliente
    `);
    return rows;
  },

  // Listar hospedagens por cliente (trazendo só um quarto por hospedagem)
  listarPorCliente: async (idCliente) => {
    const [rows] = await db.query(`
      SELECT 
        h.idHospedagem,
        h.statusHospedagem,
        h.valorExtra,
        h.FK_CLIENTE_idCliente,
        h.FK_FUNCIONARIO_idFuncionario,
        h.FK_RESERVA_idReserva,
        r.dtInicial AS dtEntrada,
        r.dtFinal AS dtSaida,
        r.valorTotal,
        (r.valorTotal + h.valorExtra) AS valorFinalHospedagem,
        quartoInfo.numeroQuarto,
        quartoInfo.tipoQuarto
      FROM HOSPEDAGEM h
      INNER JOIN RESERVA r ON h.FK_RESERVA_idReserva = r.idReserva
      LEFT JOIN (
        SELECT 
          hq.FK_HOSPEDAGEM_idHospedagem, 
          MAX(q.nomeQuarto) AS numeroQuarto, 
          MAX(tq.descricao) AS tipoQuarto
        FROM HOSPEDAGEM_QUARTO hq
        INNER JOIN QUARTO q ON q.idQuarto = hq.FK_QUARTO_idQuarto
        INNER JOIN TIPOQUARTO tq ON tq.idTipoQuarto = q.FK_TIPOQUARTO_idTipoQuarto
        GROUP BY hq.FK_HOSPEDAGEM_idHospedagem
      ) AS quartoInfo ON quartoInfo.FK_HOSPEDAGEM_idHospedagem = h.idHospedagem
      WHERE h.FK_CLIENTE_idCliente = ?
    `, [idCliente]);
    return rows;
  },

  // Buscar hospedagem por ID (trazendo só um quarto)
  buscarPorId: async (id) => {
    const [rows] = await db.query(`
      SELECT 
        h.idHospedagem,
        h.statusHospedagem,
        h.valorExtra,
        h.FK_CLIENTE_idCliente,
        h.FK_FUNCIONARIO_idFuncionario,
        h.FK_RESERVA_idReserva,
        r.dtInicial AS dtEntrada,
        r.dtFinal AS dtSaida,
        r.valorTotal,
        (r.valorTotal + h.valorExtra) AS valorFinalHospedagem,
        quartoInfo.numeroQuarto,
        quartoInfo.tipoQuarto
      FROM HOSPEDAGEM h
      INNER JOIN RESERVA r ON h.FK_RESERVA_idReserva = r.idReserva
      LEFT JOIN (
        SELECT 
          hq.FK_HOSPEDAGEM_idHospedagem, 
          MAX(q.nomeQuarto) AS numeroQuarto, 
          MAX(tq.descricao) AS tipoQuarto
        FROM HOSPEDAGEM_QUARTO hq
        INNER JOIN QUARTO q ON q.idQuarto = hq.FK_QUARTO_idQuarto
        INNER JOIN TIPOQUARTO tq ON tq.idTipoQuarto = q.FK_TIPOQUARTO_idTipoQuarto
        GROUP BY hq.FK_HOSPEDAGEM_idHospedagem
      ) AS quartoInfo ON quartoInfo.FK_HOSPEDAGEM_idHospedagem = h.idHospedagem
      WHERE h.idHospedagem = ?
    `, [id]);
    return rows;
  },

  // Criar nova hospedagem
  criar: async (hospedagem) => {
    const sql = `
      INSERT INTO HOSPEDAGEM (statusHospedagem, valorExtra, FK_CLIENTE_idCliente, FK_FUNCIONARIO_idFuncionario, FK_RESERVA_idReserva)
      VALUES (?, ?, ?, ?, ?)`;
    const values = [
      hospedagem.statusHospedagem || 'ATIVA',
      hospedagem.valorExtra || 0,
      hospedagem.FK_CLIENTE_idCliente,
      hospedagem.FK_FUNCIONARIO_idFuncionario,
      hospedagem.FK_RESERVA_idReserva
    ];
    const [resultado] = await db.query(sql, values);
    return resultado;
  },

  // Atualizar hospedagem
  atualizar: async (id, hospedagem) => {
    const sql = `
      UPDATE HOSPEDAGEM SET 
        statusHospedagem = ?, 
        valorExtra = ?,
        FK_CLIENTE_idCliente = ?, 
        FK_FUNCIONARIO_idFuncionario = ?,
        FK_RESERVA_idReserva = ?
      WHERE idHospedagem = ?`;
    const values = [
      hospedagem.statusHospedagem,
      hospedagem.valorExtra,
      hospedagem.FK_CLIENTE_idCliente,
      hospedagem.FK_FUNCIONARIO_idFuncionario,
      hospedagem.FK_RESERVA_idReserva,
      id
    ];
    const [resultado] = await db.query(sql, values);
    return resultado;
  },

  // Deletar hospedagem
  deletar: async (id) => {
    const [resultado] = await db.query('DELETE FROM HOSPEDAGEM WHERE idHospedagem = ?', [id]);
    return resultado;
  }
};

module.exports = Hospedagem;
