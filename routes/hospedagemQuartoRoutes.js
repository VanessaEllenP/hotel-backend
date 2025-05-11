const express = require('express');
const router = express.Router();
const controller = require('../controllers/hospedagemQuartoController');

router.get('/', controller.listar);
router.post('/', controller.criar);
router.delete('/:idHospedagem/:idQuarto', controller.deletar);

// Buscar quartos por hospedagem
router.get('/por-hospedagem/:idHospedagem', controller.buscarQuartosPorHospedagem);

module.exports = router;
