const Comodidade = require('../models/comodidadeModel');

exports.listarComodidades = async (req, res) => {
  try {
    const comodidades = await Comodidade.listarTodas();
    res.json(comodidades);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar comodidades' });
  }
};
