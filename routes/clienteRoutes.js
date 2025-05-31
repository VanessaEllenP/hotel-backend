const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const autenticarToken = require('../middlewares/autenticarToken');

// Rotas públicas
router.post('/', clienteController.criarCliente); // Cadastro

// Rotas autenticadas
router.use(autenticarToken);

// Listagem e leitura
router.get('/', clienteController.listarClientes); // Listar todos (uso interno)
router.get('/:id', clienteController.buscarClientePorId); // Buscar por ID

// Atualizações
router.put('/:id', clienteController.atualizarCliente); // Atualização completa
router.patch('/:id/email', clienteController.atualizarEmailCliente); // Atualizar email
router.patch('/:id/senha', clienteController.atualizarSenhaCliente); // Atualizar senha

// Remoção
router.delete('/:id', clienteController.deletarCliente); // Deletar conta

module.exports = router;
