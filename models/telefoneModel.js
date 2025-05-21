const db = require('../database/connection');

const Telefone = {
  // Criar vários telefones para um cliente
  criarTelefones: async (telefones, idCliente) => {
    const sql = `
      INSERT INTO TELEFONE (ddd, telefone, FK_CLIENTE_idCliente)
      VALUES (?, ?, ?)`;

    for (const tel of telefones) {
      const values = [tel.ddd, tel.telefone, idCliente];
      await db.query(sql, values);
    }
  },

  // Listar todos os telefones (uso interno)
  listarTodos: async () => {
    const [rows] = await db.query('SELECT * FROM TELEFONE');
    return rows;
  },

  // Buscar por cliente
  buscarPorClienteId: async (idCliente) => {
    const [rows] = await db.query('SELECT ddd, telefone FROM TELEFONE WHERE FK_CLIENTE_idCliente = ?', [idCliente]);
    return rows;
  },

  // Deletar todos os telefones de um cliente
  deletarPorCliente: async (idCliente) => {
    const [resultado] = await db.query('DELETE FROM TELEFONE WHERE FK_CLIENTE_idCliente = ?', [idCliente]);
    return resultado;
  }
};

module.exports = Telefone;
