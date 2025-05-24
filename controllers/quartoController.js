const Quarto = require('../models/quartoModel');

const quartoController = {
  // Listar todos os quartos (sem info do tipo)
  async listar(req, res) {
    try {
      const quartos = await Quarto.getAll();
      res.json(quartos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao buscar quartos.' });
    }
  },

  // Listar quartos com dados do tipo do quarto (descrição e valor)
  async listarComTipo(req, res) {
    try {
      const quartos = await Quarto.getQuartosComTipo();
      res.json(quartos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao buscar quartos com tipo.' });
    }
  },

  // Buscar quarto por ID (sem dados adicionais)
  async buscarPorId(req, res) {
    try {
      const id = req.params.id;
      const resultado = await Quarto.getById(id);

      if (resultado.length === 0) {
        return res.status(404).json({ mensagem: 'Quarto não encontrado.' });
      }

      res.json(resultado[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao buscar quarto.' });
    }
  },

  // Buscar detalhes do quarto por ID (tipo e comodidades)
  async buscarDetalhesPorId(req, res) {
    try {
      const id = req.params.id;
      const detalhes = await Quarto.getDetalhesPorId(id);

      if (!detalhes) {
        return res.status(404).json({ mensagem: 'Quarto não encontrado.' });
      }

      res.json(detalhes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao buscar detalhes do quarto.' });
    }
  },

  // Criar novo quarto
  async criar(req, res) {
    try {
      const novoQuarto = req.body;
      const resultado = await Quarto.create(novoQuarto);
      res.status(201).json({ mensagem: 'Quarto criado com sucesso!', id: resultado.insertId });
    } catch (err) {
      console.error(err);
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
      console.error(err);
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
      console.error(err);
      res.status(500).json({ erro: 'Erro ao deletar quarto.' });
    }
  },
};

module.exports = quartoController;
