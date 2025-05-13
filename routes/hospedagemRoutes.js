const express = require('express');
const router = express.Router();
const hospedagemController = require('../controllers/hospedagemController');
const autenticarToken = require('../middlewares/autenticarToken');

// Rotas para hospedagem
router.get('/', autenticarToken, hospedagemController.listarHospedagens);
router.get('/:id', autenticarToken, hospedagemController.buscarHospedagemPorId);
router.post('/', autenticarToken, hospedagemController.criarHospedagem);
router.put('/:id', autenticarToken, hospedagemController.atualizarHospedagem);
router.delete('/:id', autenticarToken, hospedagemController.deletarHospedagem);

module.exports = router;
