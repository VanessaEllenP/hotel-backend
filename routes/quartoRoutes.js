const express = require('express');
const router = express.Router();
const quartoController = require('../controllers/quartoController');

// Rotas para quartos
router.get('/com-tipo', quartoController.listarComTipo);
router.get('/detalhes/:id', quartoController.buscarDetalhesPorId);
router.get('/:id', quartoController.buscarPorId);
router.get('/', quartoController.listar);
router.post('/', quartoController.criar);
router.put('/:id', quartoController.atualizar);
router.delete('/:id', quartoController.deletar);

module.exports = router;
