const db = require('../database/connection');

const Comodidade = {
  listarTodas: async () => {
    const [rows] = await db.query('SELECT * FROM COMODIDADE');
    return rows;
  }
};

module.exports = Comodidade;
