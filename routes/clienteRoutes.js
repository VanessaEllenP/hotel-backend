const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const autenticarToken = require('../middlewares/autenticarToken');

// Cadastro de cliente
router.post('/', clienteController.criarCliente);

// Listar todos os clientes
router.get('/', autenticarToken, clienteController.listarClientes);

// Buscar cliente por ID
router.get('/:id', autenticarToken, clienteController.buscarClientePorId);

// Atualizar cliente
router.put('/:id', autenticarToken, clienteController.atualizarCliente);

// Deletar cliente 
router.delete('/:id', autenticarToken, clienteController.deletarCliente);

module.exports = router;
