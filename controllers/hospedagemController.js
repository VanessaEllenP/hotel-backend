const Hospedagem = require('../models/hospedagemModel');

// Listar hospedagens do cliente logado
exports.listarHospedagens = async (req, res) => {
  const idCliente = req.cliente.id;
  try {
    const resultados = await Hospedagem.listarPorCliente(idCliente);
    res.json(resultados);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar hospedagens' });
  }
};

// Buscar hospedagem por ID (só se for do cliente logado)
exports.buscarHospedagemPorId = async (req, res) => {
  const id = req.params.id;
  const idCliente = req.cliente.id;
  try {
    const resultado = await Hospedagem.buscarPorId(id);
    if (resultado.length === 0 || resultado[0].FK_CLIENTE_idCliente !== idCliente) {
      return res.status(403).json({ mensagem: 'Acesso não autorizado' });
    }
    res.json(resultado[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar hospedagem' });
  }
};

// Criar nova hospedagem vinculada ao cliente logado
exports.criarHospedagem = async (req, res) => {
  const novaHospedagem = {
    ...req.body,
    FK_CLIENTE_idCliente: req.cliente.id
  };
  try {
    const resultado = await Hospedagem.criar(novaHospedagem);
    res.status(201).json({ mensagem: 'Hospedagem criada com sucesso', id: resultado.insertId });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar hospedagem' });
  }
};

// Atualizar hospedagem (somente do cliente logado)
exports.atualizarHospedagem = async (req, res) => {
  const id = req.params.id;
  const idCliente = req.cliente.id;
  const dadosAtualizados = req.body;

  try {
    const resultado = await Hospedagem.buscarPorId(id);
    if (resultado.length === 0 || resultado[0].FK_CLIENTE_idCliente !== idCliente) {
      return res.status(403).json({ mensagem: 'Acesso não autorizado' });
    }

    await Hospedagem.atualizar(id, dadosAtualizados);
    res.json({ mensagem: 'Hospedagem atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar hospedagem' });
  }
};

// Deletar hospedagem (somente do cliente logado)
exports.deletarHospedagem = async (req, res) => {
  const id = req.params.id;
  const idCliente = req.cliente.id;

  try {
    const resultado = await Hospedagem.buscarPorId(id);
    if (resultado.length === 0 || resultado[0].FK_CLIENTE_idCliente !== idCliente) {
      return res.status(403).json({ mensagem: 'Acesso não autorizado' });
    }

    await Hospedagem.deletar(id);
    res.json({ mensagem: 'Hospedagem deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar hospedagem' });
  }
};
