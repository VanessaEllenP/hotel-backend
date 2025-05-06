const express = require('express');
const router = express.Router();
const quartoController = require('../controllers/quartoController');

// Rotas para quartos
router.get('/', quartoController.listar);
router.get('/:id', quartoController.buscarPorId);
router.post('/', quartoController.criar);
router.put('/:id', quartoController.atualizar);
router.delete('/:id', quartoController.deletar);

module.exports = router;
