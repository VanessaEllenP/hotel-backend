const db = require('../database/connection');

const Hospedagem = {
  // Listar todas as hospedagens
  listarTodos: async () => {
    const [rows] = await db.query('SELECT * FROM HOSPEDAGEM');
    return rows;
  },

  // Buscar hospedagem por ID
  buscarPorId: async (id) => {
    const [rows] = await db.query('SELECT * FROM HOSPEDAGEM WHERE idHospedagem = ?', [id]);
    return rows;
  },

  // Criar nova hospedagem
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

  // Atualizar hospedagem
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

  // Deletar hospedagem
  deletar: async (id) => {
    const [resultado] = await db.query('DELETE FROM HOSPEDAGEM WHERE idHospedagem = ?', [id]);
    return resultado;
  }
};

module.exports = Hospedagem;
