const db = require('../database/connection');

const Hospedagem = {
  listarTodos: async () => {
    const [rows] = await db.query('SELECT * FROM HOSPEDAGEM');
    return rows;
  },

  listarPorCliente: async (idCliente) => {
    const [rows] = await db.query(
      'SELECT * FROM HOSPEDAGEM WHERE FK_CLIENTE_idCliente = ?',
      [idCliente]
    );
    return rows;
  },

  buscarPorId: async (id) => {
    const [rows] = await db.query('SELECT * FROM HOSPEDAGEM WHERE idHospedagem = ?', [id]);
    return rows;
  },

  criar: async (hospedagem) => {
    const sql = `
      INSERT INTO HOSPEDAGEM (dtEntrada, dtSaida, statusHospedagem, FK_CLIENTE_idCliente, FK_FUNCIONARIO_idFuncionario)
      VALUES (?, ?, ?, ?, ?)`;
    const values = [
      hospedagem.dtEntrada,
      hospedagem.dtSaida,
      hospedagem.statusHospedagem || 'ATIVA',
      hospedagem.FK_CLIENTE_idCliente,
      hospedagem.FK_FUNCIONARIO_idFuncionario
    ];
    const [resultado] = await db.query(sql, values);
    return resultado;
  },

  atualizar: async (id, hospedagem) => {
    const sql = `
      UPDATE HOSPEDAGEM SET 
        dtEntrada = ?, dtSaida = ?, statusHospedagem = ?, 
        FK_CLIENTE_idCliente = ?, FK_FUNCIONARIO_idFuncionario = ?
      WHERE idHospedagem = ?`;
    const values = [
      hospedagem.dtEntrada,
      hospedagem.dtSaida,
      hospedagem.statusHospedagem,
      hospedagem.FK_CLIENTE_idCliente,
      hospedagem.FK_FUNCIONARIO_idFuncionario,
      id
    ];
    const [resultado] = await db.query(sql, values);
    return resultado;
  },

  deletar: async (id) => {
    const [resultado] = await db.query('DELETE FROM HOSPEDAGEM WHERE idHospedagem = ?', [id]);
    return resultado;
  }
};

module.exports = Hospedagem;
