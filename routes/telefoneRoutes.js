const express = require('express');
const router = express.Router();
const telefoneController = require('../controllers/telefoneController');

// Listar todos os telefones
router.get('/', telefoneController.listar);

// Buscar telefones por ID do cliente
router.get('/cliente/:idCliente', telefoneController.buscarPorCliente);

// Criar um ou mais telefones para um cliente
router.post('/', telefoneController.criar);

// Deletar todos os telefones de um cliente
router.delete('/cliente/:idCliente', telefoneController.deletarPorCliente);

module.exports = router;
