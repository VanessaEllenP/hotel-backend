const Hospedagem = require('../models/hospedagemModel');

// Listar todas as hospedagens
exports.listarHospedagens = async (req, res) => {
  try {
    const resultados = await Hospedagem.listarTodos();
    res.json(resultados);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar hospedagens' });
  }
};

// Buscar hospedagem por ID
exports.buscarHospedagemPorId = async (req, res) => {
  const id = req.params.id;
  try {
    const resultado = await Hospedagem.buscarPorId(id);
    if (resultado.length === 0) {
      return res.status(404).json({ mensagem: 'Hospedagem não encontrada' });
    }
    res.json(resultado[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar hospedagem' });
  }
};

// Criar nova hospedagem
exports.criarHospedagem = async (req, res) => {
  const novaHospedagem = req.body;
  try {
    const resultado = await Hospedagem.criar(novaHospedagem);
    res.status(201).json({ mensagem: 'Hospedagem criada com sucesso', id: resultado.insertId });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar hospedagem' });
  }
};

// Atualizar hospedagem
exports.atualizarHospedagem = async (req, res) => {
  const id = req.params.id;
  const dadosAtualizados = req.body;
  try {
    await Hospedagem.atualizar(id, dadosAtualizados);
    res.json({ mensagem: 'Hospedagem atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar hospedagem' });
  }
};

// Deletar hospedagem
exports.deletarHospedagem = async (req, res) => {
  const id = req.params.id;
  try {
    await Hospedagem.deletar(id);
    res.json({ mensagem: 'Hospedagem deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar hospedagem' });
  }
};
