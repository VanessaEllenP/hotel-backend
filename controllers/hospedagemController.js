const Hospedagem = require('../models/hospedagemModel');

// Listar hospedagens do cliente logado, agrupando quartos
exports.listarHospedagens = async (req, res) => {
  const idCliente = req.cliente.id;

  try {
    const resultados = await Hospedagem.listarPorCliente(idCliente);

    const hospedagensMap = new Map();

    resultados.forEach(row => {
      const id = row.idHospedagem;

      if (!hospedagensMap.has(id)) {
        hospedagensMap.set(id, {
          idHospedagem: row.idHospedagem,
          statusHospedagem: row.statusHospedagem,
          dtEntrada: row.dtEntrada,
          dtSaida: row.dtSaida,
          valorReserva: row.valorTotal || 0,
          valorExtra: row.valorExtra || 0,
          valorFinal: row.valorFinalHospedagem || 0,
          quartos: []
        });
      }

      if (row.nomeQuarto) {
        hospedagensMap.get(id).quartos.push({
          nomeQuarto: row.nomeQuarto,
          tipoQuarto: row.tipoQuarto
        });
      }
    });

    const hospedagensFormatadas = Array.from(hospedagensMap.values());
    res.json(hospedagensFormatadas);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar hospedagens' });
  }
};

// Buscar hospedagem por ID, agrupando quartos
exports.buscarHospedagemPorId = async (req, res) => {
  const id = req.params.id;
  const idCliente = req.cliente.id;

  try {
    const resultados = await Hospedagem.buscarPorId(id);

    if (!resultados || resultados.length === 0 || resultados[0].FK_CLIENTE_idCliente !== idCliente) {
      return res.status(403).json({ mensagem: 'Acesso não autorizado' });
    }

    const hospedagem = {
      idHospedagem: resultados[0].idHospedagem,
      statusHospedagem: resultados[0].statusHospedagem,
      dtEntrada: resultados[0].dtEntrada,
      dtSaida: resultados[0].dtSaida,
      valorReserva: resultados[0].valorTotal || 0,
      valorExtra: resultados[0].valorExtra || 0,
      valorFinal: resultados[0].valorFinalHospedagem || 0,
      quartos: []
    };

    resultados.forEach(row => {
      if (row.nomeQuarto) {
        hospedagem.quartos.push({
          nomeQuarto: row.nomeQuarto,
          tipoQuarto: row.tipoQuarto
        });
      }
    });

    res.json(hospedagem);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar hospedagem' });
  }
};

// Criar nova hospedagem vinculada ao cliente logado
exports.criarHospedagem = async (req, res) => {
  const { FK_FUNCIONARIO_idFuncionario, FK_RESERVA_idReserva, valorExtra, statusHospedagem, quartos } = req.body;

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
    const idHospedagem = resultado.insertId;

    if (Array.isArray(quartos) && quartos.length > 0) {
      await Hospedagem.adicionarQuartos(idHospedagem, quartos);
    }

    res.status(201).json({ mensagem: 'Hospedagem criada com sucesso', id: idHospedagem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar hospedagem' });
  }
};

// Atualizar hospedagem (somente do cliente logado)
exports.atualizarHospedagem = async (req, res) => {
  const id = req.params.id;
  const idCliente = req.cliente.id;
  const { quartos, ...dadosAtualizados } = req.body;

  try {
    const resultado = await Hospedagem.buscarPorId(id);
    if (resultado.length === 0 || resultado[0].FK_CLIENTE_idCliente !== idCliente) {
      return res.status(403).json({ mensagem: 'Acesso não autorizado' });
    }

    dadosAtualizados.FK_CLIENTE_idCliente = idCliente;

    await Hospedagem.atualizar(id, dadosAtualizados);

    if (Array.isArray(quartos)) {
      await Hospedagem.removerQuartos(id);
      if (quartos.length > 0) {
        await Hospedagem.adicionarQuartos(id, quartos);
      }
    }

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

    await Hospedagem.removerQuartos(id);
    await Hospedagem.deletar(id);

    res.json({ mensagem: 'Hospedagem deletada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao deletar hospedagem' });
  }
};