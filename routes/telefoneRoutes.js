const express = require('express');
const router = express.Router();
const telefoneController = require('../controllers/telefoneController');

// Listar todos os telefones
router.get('/', telefoneController.listar);

// Buscar telefone por ID
router.get('/:id', telefoneController.buscarPorId);

// Criar novo telefone
router.post('/', telefoneController.criar);

// Atualizar telefone existente
router.put('/:id', telefoneController.atualizar);

// Deletar telefone
router.delete('/:id', telefoneController.deletar);

module.exports = router;
