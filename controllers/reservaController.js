const Reserva = require('../models/reservaModel');

const reservaController = {
  listar: async (req, res) => {
    try {
      const results = await Reserva.getAll();
      res.json(results);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar reservas.' });
    }
  },

  buscarPorId: async (req, res) => {
    const id = req.params.id;
    try {
      const results = await Reserva.getById(id);
      if (results.length === 0) {
        return res.status(404).json({ mensagem: 'Reserva não encontrada.' });
      }
      res.json(results[0]);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar reserva.' });
    }
  },

  criar: async (req, res) => {
    const novaReserva = req.body;
    try {
      const result = await Reserva.create(novaReserva);
      res.status(201).json({ mensagem: 'Reserva cadastrada com sucesso!', id: result.insertId });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao cadastrar reserva.' });
    }
  },

  atualizar: async (req, res) => {
    const id = req.params.id;
    const dados = req.body;
    try {
      await Reserva.update(id, dados);
      res.json({ mensagem: 'Reserva atualizada com sucesso!' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar reserva.' });
    }
  },

  deletar: async (req, res) => {
    const id = req.params.id;
    try {
      await Reserva.delete(id);
      res.json({ mensagem: 'Reserva excluída com sucesso!' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao excluir reserva.' });
    }
  }
};

module.exports = reservaController;
