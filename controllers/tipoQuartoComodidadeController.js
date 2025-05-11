const TipoQuartoComodidade = require('../models/tipoQuartoComodidadeModel');

exports.listar = async (req, res) => {
  try {
    const resultado = await TipoQuartoComodidade.listarTodos();
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar tipoQuarto/comodidade' });
  }
};

exports.criar = async (req, res) => {
  const dados = req.body;
  try {
    await TipoQuartoComodidade.criar(dados);
    res.status(201).json({ mensagem: 'Associação criada com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar associação' });
  }
};

exports.deletar = async (req, res) => {
  const { idTipoQuarto, idComodidade } = req.params;
  try {
    await TipoQuartoComodidade.deletar(idTipoQuarto, idComodidade);
    res.json({ mensagem: 'Associação deletada com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar associação' });
  }
};

exports.buscarPorTipoQuarto = async (req, res) => {
  const idTipoQuarto = req.params.idTipoQuarto;
  try {
    const resultado = await TipoQuartoComodidade.buscarPorTipoQuarto(idTipoQuarto);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar comodidades do tipo de quarto' });
  }
};
