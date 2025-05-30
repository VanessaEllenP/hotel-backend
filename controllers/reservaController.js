const Reserva = require('../models/reservaModel');
const Hospedagem = require('../models/hospedagemModel');

const reservaController = {
  // Listar reservas do cliente logado
  listar: async (req, res) => {
    const clienteId = req.cliente.id;
    try {
      const results = await Reserva.getByClienteId(clienteId);
      res.json(results);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar reservas.' });
    }
  },

  // Buscar reserva por ID, só se for do cliente logado
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

  // Simular valor da reserva
  simularValor: async (req, res) => {
    const { idTipoQuarto, checkIn, checkOut } = req.body;

    try {
      const [resultado] = await Reserva.simularValor(idTipoQuarto, checkIn, checkOut);
      const valorTotal = resultado[0].valorTotal;
      res.json({ valorTotal });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao simular valor da reserva.' });
    }
  },

  // Criar reserva vinculada ao cliente logado
  criar: async (req, res) => {
    const novaReserva = req.body;
    novaReserva.FK_CLIENTE_idCliente = req.cliente.id;

    try {
      const result = await Reserva.create(novaReserva);
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

      await Reserva.update(id, dados);

      if (dados.statusReserva === 'CONFIRMADA') {
        return res.json({ mensagem: 'Reserva confirmada e hospedagem criada com sucesso!' });
      } else {
        return res.json({ mensagem: 'Reserva atualizada com sucesso!' });
      }
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
};

module.exports = reservaController;
