const TipoQuarto = require('../models/tipoQuartoModel');

exports.listarTodos = async (req, res) => {
  try {
    const resultado = await TipoQuarto.listarTodos();
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar tipos de quarto' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const resultado = await TipoQuarto.buscarPorId(req.params.id);
    if (resultado.length === 0) return res.status(404).json({ mensagem: 'Tipo de quarto não encontrado' });
    res.json(resultado[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar tipo de quarto' });
  }
};

exports.criar = async (req, res) => {
  try {
    const resultado = await TipoQuarto.criar(req.body);
    res.status(201).json({ mensagem: 'Tipo de quarto criado com sucesso', id: resultado.insertId });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar tipo de quarto' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    await TipoQuarto.atualizar(req.params.id, req.body);
    res.json({ mensagem: 'Tipo de quarto atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar tipo de quarto' });
  }
};

exports.deletar = async (req, res) => {
  try {
    await TipoQuarto.deletar(req.params.id);
    res.json({ mensagem: 'Tipo de quarto deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar tipo de quarto' });
  }
};