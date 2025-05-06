const express = require('express');
const router = express.Router();
const hospedagemController = require('../controllers/hospedagemController');

// Rotas para hospedagem
router.get('/', hospedagemController.listarHospedagens);
router.get('/:id', hospedagemController.buscarHospedagemPorId);
router.post('/', hospedagemController.criarHospedagem);
router.put('/:id', hospedagemController.atualizarHospedagem);
router.delete('/:id', hospedagemController.deletarHospedagem);

module.exports = router;
