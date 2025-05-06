const Quarto = require('../models/quartoModel');

const quartoController = {
  // Listar todos os quartos
  async listar(req, res) {
    try {
      const quartos = await Quarto.getAll();
      res.json(quartos);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar quartos.' });
    }
  },

  // Buscar quarto por ID
  async buscarPorId(req, res) {
    try {
      const id = req.params.id;
      const resultado = await Quarto.getById(id);

      if (resultado.length === 0) {
        return res.status(404).json({ mensagem: 'Quarto não encontrado.' });
      }

      res.json(resultado[0]);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar quarto.' });
    }
  },

  // Criar novo quarto
  async criar(req, res) {
    try {
      const novoQuarto = req.body;
      const resultado = await Quarto.create(novoQuarto);
      res.status(201).json({ mensagem: 'Quarto criado com sucesso!', id: resultado.insertId });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao criar quarto.' });
    }
  },

  // Atualizar quarto
  async atualizar(req, res) {
    try {
      const id = req.params.id;
      const dados = req.body;
      await Quarto.update(id, dados);
      res.json({ mensagem: 'Quarto atualizado com sucesso!' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar quarto.' });
    }
  },

  // Deletar quarto
  async deletar(req, res) {
    try {
      const id = req.params.id;
      await Quarto.delete(id);
      res.json({ mensagem: 'Quarto deletado com sucesso!' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao deletar quarto.' });
    }
  }
};

module.exports = quartoController;
