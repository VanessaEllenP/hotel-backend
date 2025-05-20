const Reserva = require('../models/reservaModel');
const Hospedagem = require('../models/hospedagemModel');

const reservaController = {
  // Listar reservas do cliente logado
  listar: async (req, res) => {
    const clienteId = req.cliente.id; // vem do token
    try {
      const results = await Reserva.getByClienteId(clienteId);
      res.json(results);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar reservas.' });
    }
  },

  // Buscar reserva por ID, mas apenas se for do cliente logado
  buscarPorId: async (req, res) => {
    const id = req.params.id;
    const clienteId = req.cliente.id;
    try {
      const results = await Reserva.getById(id);
      if (results.length === 0) {
        return res.status(404).json({ mensagem: 'Reserva não encontrada.' });
      }
      if (results[0].FK_CLIENTE_idCliente !== clienteId) {
        return res.status(403).json({ mensagem: 'Acesso negado a esta reserva.' });
      }
      res.json(results[0]);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar reserva.' });
    }
  },

  // Criar reserva vinculada ao cliente logado
  criar: async (req, res) => {
    const novaReserva = req.body;
    novaReserva.FK_CLIENTE_idCliente = req.cliente.id; // <- CORRETO
    
    try {
      const result = await Reserva.create(novaReserva); // O valor total será calculado no modelo
      res.status(201).json({ mensagem: 'Reserva cadastrada com sucesso!', id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao cadastrar reserva.' });
    }
  },  

  // Atualizar somente se for do cliente logado
  atualizar: async (req, res) => {
    const id = req.params.id;
    const dados = req.body;
    const clienteId = req.cliente.id;

    try {
      const reserva = await Reserva.getById(id);
      if (reserva.length === 0) {
        return res.status(404).json({ mensagem: 'Reserva não encontrada.' });
      }
      if (reserva[0].FK_CLIENTE_idCliente !== clienteId) {
        return res.status(403).json({ mensagem: 'Você não tem permissão para atualizar esta reserva.' });
      }

      await Reserva.update(id, dados); // O valor total será recalculado no modelo
      res.json({ mensagem: 'Reserva atualizada com sucesso!' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar reserva.' });
    }
  },

  // Deletar somente se for do cliente logado
  deletar: async (req, res) => {
    const id = req.params.id;
    const clienteId = req.cliente.id;

    try {
      const reserva = await Reserva.getById(id);
      if (reserva.length === 0) {
        return res.status(404).json({ mensagem: 'Reserva não encontrada.' });
      }
      if (reserva[0].FK_CLIENTE_idCliente !== clienteId) {
        return res.status(403).json({ mensagem: 'Você não tem permissão para excluir esta reserva.' });
      }

      await Reserva.delete(id);
      res.json({ mensagem: 'Reserva excluída com sucesso!' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao excluir reserva.' });
    }
  },

  // Confirmar reserva e criar hospedagem automaticamente
  confirmarEIniciarHospedagem: async (req, res) => {
    const idReserva = req.params.id;
    const clienteId = req.cliente.id;
    const { valorExtra, FK_FUNCIONARIO_idFuncionario } = req.body; // opcional, adapte conforme seu modelo

    try {
      // 1. Verifica se a reserva existe e pertence ao cliente
      const reserva = await Reserva.getById(idReserva);
      if (reserva.length === 0) {
        return res.status(404).json({ mensagem: 'Reserva não encontrada.' });
      }
      if (reserva[0].FK_CLIENTE_idCliente !== clienteId) {
        return res.status(403).json({ mensagem: 'Você não tem permissão para confirmar esta reserva.' });
      }

      // 2. Atualiza o status da reserva para 'confirmada'
      await Reserva.updateStatus(idReserva, 'confirmada');

      // 3. Cria a hospedagem vinculada à reserva
      const novaHospedagem = {
        statusHospedagem: 'ATIVA',
        valorExtra: valorExtra || 0,
        FK_CLIENTE_idCliente: clienteId,
        FK_FUNCIONARIO_idFuncionario: FK_FUNCIONARIO_idFuncionario || null,
        FK_RESERVA_idReserva: idReserva
      };

      const resultadoHospedagem = await Hospedagem.create(novaHospedagem);

      res.status(201).json({
        mensagem: 'Reserva confirmada e hospedagem criada com sucesso!',
        idHospedagem: resultadoHospedagem.insertId
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao confirmar reserva e criar hospedagem.' });
    }
  }
};

module.exports = reservaController;