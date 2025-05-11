const Telefone = require('../models/telefoneModel');

exports.listar = async (req, res) => {
  try {
    const telefones = await Telefone.listarTodos();
    res.json(telefones);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar telefones' });
  }
};

exports.buscarPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const telefone = await Telefone.buscarPorId(id);
    if (!telefone) {
      return res.status(404).json({ erro: 'Telefone não encontrado' });
    }
    res.json(telefone);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar telefone' });
  }
};

exports.criar = async (req, res) => {
  const dados = req.body;
  try {
    const id = await Telefone.criar(dados);
    res.status(201).json({ mensagem: 'Telefone cadastrado com sucesso!', id });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar telefone' });
  }
};

exports.atualizar = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  try {
    await Telefone.atualizar(id, dados);
    res.json({ mensagem: 'Telefone atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar telefone' });
  }
};

exports.deletar = async (req, res) => {
  const { id } = req.params;
  try {
    await Telefone.deletar(id);
    res.json({ mensagem: 'Telefone deletado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar telefone' });
  }
};
