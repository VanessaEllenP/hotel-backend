const Telefone = require('../models/telefoneModel');

// Listar todos os telefones
exports.listar = async (req, res) => {
  try {
    const telefones = await Telefone.listarTodos();
    res.json(telefones);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar telefones' });
  }
};

// Buscar telefones por cliente (mais apropriado com sua modelagem)
exports.buscarPorCliente = async (req, res) => {
  const idCliente = parseInt(req.params.idCliente);
  try {
    const telefones = await Telefone.buscarPorClienteId(idCliente);
    res.json(telefones);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar telefones do cliente' });
  }
};

// Criar um ou mais telefones para um cliente
exports.criar = async (req, res) => {
  const { idCliente, telefones } = req.body;

  if (!idCliente || !Array.isArray(telefones)) {
    return res.status(400).json({ erro: 'Informe o idCliente e a lista de telefones' });
  }

  try {
    await Telefone.criarTelefones(telefones, idCliente);
    res.status(201).json({ mensagem: 'Telefones cadastrados com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar telefones' });
  }
};

// Atualizar telefone(s) do cliente
exports.atualizarTelefone = async (req, res) => {
  const idCliente = parseInt(req.params.idCliente);
  const telefones = req.body.telefones;

  if (!idCliente || !Array.isArray(telefones)) {
    return res.status(400).json({ erro: 'Informe o idCliente e a lista de telefones' });
  }

  try {
    await Telefone.atualizarTelefone(idCliente, telefones);
    res.json({ mensagem: 'Telefone(s) atualizado(s) com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar telefone(s)' });
  }
};

// Deletar todos os telefones de um cliente
exports.deletarPorCliente = async (req, res) => {
  const idCliente = parseInt(req.params.idCliente);
  try {
    await Telefone.deletarPorCliente(idCliente);
    res.json({ mensagem: 'Telefones deletados com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar telefones' });
  }
};
