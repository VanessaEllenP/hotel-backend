const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const autenticarCliente = require('../middlewares/autenticarToken'); 

// Listar reservas do cliente logado
router.get('/', autenticarCliente, reservaController.listar);

// Buscar reserva por ID, mas somente se for do cliente logado
router.get('/:id', autenticarCliente, reservaController.buscarPorId);

// Criar nova reserva vinculada ao cliente logado
router.post('/', autenticarCliente, reservaController.criar);

// Atualizar reserva somente se for do cliente logado
router.put('/:id', autenticarCliente, reservaController.atualizar);

// Deletar reserva somente se for do cliente logado
router.delete('/:id', autenticarCliente, reservaController.deletar);

// Confirmar reserva e criar hospedagem automaticamente
router.post('/:id/confirmar', autenticarCliente, reservaController.confirmarEIniciarHospedagem);

module.exports = router;
