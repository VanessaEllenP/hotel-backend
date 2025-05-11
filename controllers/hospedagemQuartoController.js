const HospedagemQuarto = require('../models/hospedagemQuartoModel');

exports.listar = async (req, res) => {
  try {
    const resultado = await HospedagemQuarto.listarTodos();
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar hospedagem/quarto' });
  }
};

exports.criar = async (req, res) => {
  const dados = req.body;
  try {
    await HospedagemQuarto.criar(dados);
    res.status(201).json({ mensagem: 'Quarto associado à hospedagem com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar associação' });
  }
};

exports.deletar = async (req, res) => {
  const { idHospedagem, idQuarto } = req.params;
  try {
    await HospedagemQuarto.deletar(idHospedagem, idQuarto);
    res.json({ mensagem: 'Associação deletada com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar associação' });
  }
};

// Buscar quartos por hospedagem
exports.buscarQuartosPorHospedagem = async (req, res) => {
  const idHospedagem = req.params.idHospedagem;
  try {
    const resultado = await HospedagemQuarto.buscarPorHospedagem(idHospedagem);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar quartos da hospedagem' });
  }
};
