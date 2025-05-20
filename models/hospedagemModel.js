const db = require('../database/connection');

const Hospedagem = {
  // Listar todas as hospedagens com dados da reserva, cliente e quarto (se houver)
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
        c.nome AS nomeCliente,
        q.nomeQuarto,
        tq.descricao AS tipoQuarto
      FROM HOSPEDAGEM h
      INNER JOIN RESERVA r ON h.FK_RESERVA_idReserva = r.idReserva
      INNER JOIN CLIENTE c ON h.FK_CLIENTE_idCliente = c.idCliente
      LEFT JOIN HOSPEDAGEM_QUARTO hq ON hq.FK_HOSPEDAGEM_idHospedagem = h.idHospedagem
      LEFT JOIN QUARTO q ON q.idQuarto = hq.FK_QUARTO_idQuarto
      LEFT JOIN TIPOQUARTO tq ON tq.idTipoQuarto = q.FK_TIPOQUARTO_idTipoQuarto
    `);
    return rows;
  },

  // Listar hospedagens por cliente (trazendo nome e tipo do quarto, se houver)
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
        q.nomeQuarto,
        tq.descricao AS tipoQuarto
      FROM HOSPEDAGEM h
      INNER JOIN RESERVA r ON h.FK_RESERVA_idReserva = r.idReserva
      LEFT JOIN HOSPEDAGEM_QUARTO hq ON hq.FK_HOSPEDAGEM_idHospedagem = h.idHospedagem
      LEFT JOIN QUARTO q ON q.idQuarto = hq.FK_QUARTO_idQuarto
      LEFT JOIN TIPOQUARTO tq ON tq.idTipoQuarto = q.FK_TIPOQUARTO_idTipoQuarto
      WHERE h.FK_CLIENTE_idCliente = ?
    `, [idCliente]);
    return rows;
  },

  // Buscar hospedagem por ID (com quarto e tipo, se houver)
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
        q.nomeQuarto,
        tq.descricao AS tipoQuarto
      FROM HOSPEDAGEM h
      INNER JOIN RESERVA r ON h.FK_RESERVA_idReserva = r.idReserva
      LEFT JOIN HOSPEDAGEM_QUARTO hq ON hq.FK_HOSPEDAGEM_idHospedagem = h.idHospedagem
      LEFT JOIN QUARTO q ON q.idQuarto = hq.FK_QUARTO_idQuarto
      LEFT JOIN TIPOQUARTO tq ON tq.idTipoQuarto = q.FK_TIPOQUARTO_idTipoQuarto
      WHERE h.idHospedagem = ?
    `, [id]);
    return rows;  // retorna array para permitir múltiplos quartos vinculados
  },

  // Criar nova hospedagem (só cria na tabela HOSPEDAGEM)
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
  },

  // Adicionar quartos vinculados a uma hospedagem
  adicionarQuartos: async (idHospedagem, quartos) => {
    if (!Array.isArray(quartos) || quartos.length === 0) return;

    // Monta array para inserção múltipla
    const values = quartos.map(idQuarto => [idHospedagem, idQuarto]);

    const sql = 'INSERT INTO HOSPEDAGEM_QUARTO (FK_HOSPEDAGEM_idHospedagem, FK_QUARTO_idQuarto) VALUES ?';

    const [resultado] = await db.query(sql, [values]);
    return resultado;
  },

  // Remover quartos vinculados a uma hospedagem
  removerQuartos: async (idHospedagem) => {
    const sql = 'DELETE FROM HOSPEDAGEM_QUARTO WHERE FK_HOSPEDAGEM_idHospedagem = ?';

    const [resultado] = await db.query(sql, [idHospedagem]);
    return resultado;
  }
};

module.exports = Hospedagem;