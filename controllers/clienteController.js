const Cliente = require('../models/clienteModel');
const bcrypt = require('bcrypt');

// Listar todos os clientes (uso interno, proteja com autenticação se necessário)
exports.listarClientes = async (req, res) => {
  try {
    const resultados = await Cliente.listarTodos();
    res.json(resultados);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar clientes' });
  }
};

// Buscar cliente por ID (apenas o próprio cliente pode ver)
exports.buscarClientePorId = async (req, res) => {
  const id = parseInt(req.params.id);
  const clienteLogadoId = req.cliente.id;

  if (id !== clienteLogadoId) {
    return res.status(403).json({ erro: 'Acesso negado aos dados de outro cliente' });
  }

  try {
    const resultado = await Cliente.buscarPorId(id);
    if (resultado.length === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }
    res.json(resultado[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar cliente' });
  }
};

// Criar novo cliente com senha criptografada (sem proteção)
exports.criarCliente = async (req, res) => {
  const novoCliente = req.body;
  try {
    const senhaCriptografada = await bcrypt.hash(novoCliente.senha, 10);
    novoCliente.senha = senhaCriptografada;

    const resultado = await Cliente.criar(novoCliente);
    res.status(201).json({ mensagem: 'Cliente criado com sucesso', id: resultado.insertId });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar cliente' });
  }
};

// Atualizar cliente (somente o próprio cliente pode atualizar)
exports.atualizarCliente = async (req, res) => {
  const id = parseInt(req.params.id);
  const clienteLogadoId = req.cliente.id;

  if (id !== clienteLogadoId) {
    return res.status(403).json({ erro: 'Você só pode atualizar seus próprios dados' });
  }

  const dadosAtualizados = req.body;

  // Se a senha for alterada, criptografe-a novamente
  if (dadosAtualizados.senha) {
    dadosAtualizados.senha = await bcrypt.hash(dadosAtualizados.senha, 10);
  }

  try {
    await Cliente.atualizar(id, dadosAtualizados);
    res.json({ mensagem: 'Cliente atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar cliente' });
  }
};

// Deletar cliente (somente o próprio cliente pode deletar)
exports.deletarCliente = async (req, res) => {
  const id = parseInt(req.params.id);
  const clienteLogadoId = req.cliente.id;

  if (id !== clienteLogadoId) {
    return res.status(403).json({ erro: 'Você só pode deletar sua própria conta' });
  }

  try {
    await Cliente.deletar(id);
    res.json({ mensagem: 'Cliente deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar cliente' });
  }
};
