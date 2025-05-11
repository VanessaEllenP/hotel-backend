const Funcionario = require('../models/funcionarioModel');

exports.listar = async (req, res) => {
  try {
    const funcionarios = await Funcionario.listarTodos();
    res.json(funcionarios);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar funcionários' });
  }
};

exports.buscarPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const funcionario = await Funcionario.buscarPorId(id);
    if (funcionario) {
      res.json(funcionario);
    } else {
      res.status(404).json({ erro: 'Funcionário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar funcionário' });
  }
};

exports.criar = async (req, res) => {
  const dados = req.body;
  try {
    await Funcionario.criar(dados);
    res.status(201).json({ mensagem: 'Funcionário criado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar funcionário' });
  }
};

exports.atualizar = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  try {
    await Funcionario.atualizar(id, dados);
    res.json({ mensagem: 'Funcionário atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar funcionário' });
  }
};

exports.deletar = async (req, res) => {
  const { id } = req.params;
  try {
    await Funcionario.deletar(id);
    res.json({ mensagem: 'Funcionário deletado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar funcionário' });
  }
};
