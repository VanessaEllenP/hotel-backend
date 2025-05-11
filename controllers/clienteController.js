const Cliente = require('../models/clienteModel');
const bcrypt = require('bcrypt');

// Listar todos os clientes
exports.listarClientes = async (req, res) => {
  try {
    const resultados = await Cliente.listarTodos();
    res.json(resultados);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar clientes' });
  }
};

// Buscar cliente por ID
exports.buscarClientePorId = async (req, res) => {
  const id = req.params.id;
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

// Criar novo cliente com senha criptografada
exports.criarCliente = async (req, res) => {
  const novoCliente = req.body;
  try {
    // Criptografar a senha antes de salvar
    const senhaCriptografada = await bcrypt.hash(novoCliente.senha, 10);
    novoCliente.senha = senhaCriptografada;

    const resultado = await Cliente.criar(novoCliente);
    res.status(201).json({ mensagem: 'Cliente criado com sucesso', id: resultado.insertId });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar cliente' });
  }
};

// Atualizar cliente
exports.atualizarCliente = async (req, res) => {
  const id = req.params.id;
  const dadosAtualizados = req.body;
  try {
    await Cliente.atualizar(id, dadosAtualizados);
    res.json({ mensagem: 'Cliente atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar cliente' });
  }
};

// Deletar cliente
exports.deletarCliente = async (req, res) => {
  const id = req.params.id;
  try {
    await Cliente.deletar(id);
    res.json({ mensagem: 'Cliente deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar cliente' });
  }
};
