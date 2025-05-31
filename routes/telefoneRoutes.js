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

// Atualizar telefone de um cliente
router.put('/cliente/:idCliente', telefoneController.atualizarTelefone);

module.exports = router;
