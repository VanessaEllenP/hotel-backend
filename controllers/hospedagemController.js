const Hospedagem = require('../models/hospedagemModel');

// Listar hospedagens do cliente logado
exports.listarHospedagens = async (req, res) => {
  const idCliente = req.cliente.id;

  try {
    const resultados = await Hospedagem.listarPorCliente(idCliente);

    // Cada hospedagem traz no máximo 1 quarto, então converte para array com 1 elemento ou vazio
    const hospedagensFormatadas = resultados.map(h => ({
      idHospedagem: h.idHospedagem,
      statusHospedagem: h.statusHospedagem,
      dtEntrada: h.dtEntrada,
      dtSaida: h.dtSaida,
      valorReserva: h.valorTotal || 0,
      valorExtra: h.valorExtra || 0,
      valorFinal: h.valorFinalHospedagem || 0,
      quartos: h.numeroQuarto ? [{ numeroQuarto: h.numeroQuarto, tipoQuarto: h.tipoQuarto }] : []
    }));

    res.json(hospedagensFormatadas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar hospedagens' });
  }
};

// Buscar hospedagem por ID (só se for do cliente logado)
exports.buscarHospedagemPorId = async (req, res) => {
  const id = req.params.id;
  const idCliente = req.cliente.id;

  try {
    const resultado = await Hospedagem.buscarPorId(id);
    const hospedagem = resultado[0];

    if (!hospedagem || hospedagem.FK_CLIENTE_idCliente !== idCliente) {
      return res.status(403).json({ mensagem: 'Acesso não autorizado' });
    }

    const hospedagemFormatada = {
      idHospedagem: hospedagem.idHospedagem,
      statusHospedagem: hospedagem.statusHospedagem,
      dtEntrada: hospedagem.dtEntrada,
      dtSaida: hospedagem.dtSaida,
      valorReserva: hospedagem.valorTotal || 0,
      valorExtra: hospedagem.valorExtra || 0,
      valorFinal: hospedagem.valorFinalHospedagem || 0,
      quartos: hospedagem.numeroQuarto ? [{ numeroQuarto: hospedagem.numeroQuarto, tipoQuarto: hospedagem.tipoQuarto }] : []
    };

    res.json(hospedagemFormatada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar hospedagem' });
  }
};

// Criar nova hospedagem vinculada ao cliente logado
exports.criarHospedagem = async (req, res) => {
  const { FK_FUNCIONARIO_idFuncionario, FK_RESERVA_idReserva, valorExtra, statusHospedagem } = req.body;

  if (!FK_FUNCIONARIO_idFuncionario || !FK_RESERVA_idReserva) {
    return res.status(400).json({ erro: 'Funcionário e reserva são obrigatórios' });
  }

  const novaHospedagem = {
    statusHospedagem: statusHospedagem || 'ATIVA',
    valorExtra: valorExtra || 0,
    FK_CLIENTE_idCliente: req.cliente.id,
    FK_FUNCIONARIO_idFuncionario,
    FK_RESERVA_idReserva
  };

  try {
    const resultado = await Hospedagem.criar(novaHospedagem);
    res.status(201).json({ mensagem: 'Hospedagem criada com sucesso', id: resultado.insertId });
  } catch (err) {
    console.error(err);
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

    // Garante que o cliente não será trocado
    dadosAtualizados.FK_CLIENTE_idCliente = idCliente;

    await Hospedagem.atualizar(id, dadosAtualizados);
    res.json({ mensagem: 'Hospedagem atualizada com sucesso' });
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ erro: 'Erro ao deletar hospedagem' });
  }
};
