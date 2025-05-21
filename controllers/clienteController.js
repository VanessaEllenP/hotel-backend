const Cliente = require('../models/clienteModel');
const Telefone = require('../models/telefoneModel');
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
    if (!resultado) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar cliente' });
  }
};

// Criar novo cliente com senha criptografada (sem proteção)
exports.criarCliente = async (req, res) => {
  const novoCliente = req.body;

  if (!novoCliente.dataNascimento) {
    return res.status(400).json({ erro: 'Data de nascimento é obrigatória' });
  }

  try {
    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(novoCliente.senha, 10);
    novoCliente.senha = senhaCriptografada;

    // Cria cliente e pega o insertId direto do model (alteração aqui)
    const idCliente = await Cliente.criar(novoCliente);

    // Se vier lista de telefones no corpo, cria os telefones
    if (novoCliente.telefones && Array.isArray(novoCliente.telefones) && novoCliente.telefones.length > 0) {
      await Telefone.criarTelefones(novoCliente.telefones, idCliente);
    }

    res.status(201).json({ mensagem: 'Cliente criado com sucesso', id: idCliente });
  } catch (err) {
    console.error(err);
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

  if (!dadosAtualizados.dataNascimento) {
    return res.status(400).json({ erro: 'Data de nascimento é obrigatória' });
  }

  // Se a senha for alterada, criptografe-a novamente
  if (dadosAtualizados.senha) {
    dadosAtualizados.senha = await bcrypt.hash(dadosAtualizados.senha, 10);
  }

  try {
    // Atualiza dados do cliente
    await Cliente.atualizar(id, dadosAtualizados);

    // Atualiza telefones, se enviados
    if (dadosAtualizados.telefones && Array.isArray(dadosAtualizados.telefones)) {
      // Apaga telefones antigos
      await Telefone.deletarPorCliente(id);
      // Insere os novos, se houver
      if (dadosAtualizados.telefones.length > 0) {
        await Telefone.criarTelefones(dadosAtualizados.telefones, id);
      }
    }

    res.json({ mensagem: 'Cliente e telefones atualizados com sucesso' });
  } catch (err) {
    console.error(err);
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
