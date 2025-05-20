const express = require('express');
const router = express.Router();
const controller = require('../controllers/hospedagemQuartoController');

// Listar todas as associações hospedagem-quarto
router.get('/', controller.listar);

// Criar associação individual (1 quarto x 1 hospedagem)
router.post('/', controller.criar);

// Criar associação com múltiplos quartos
router.post('/associar-multiplos', controller.associarMultiplosQuartos);

// Deletar associação específica
router.delete('/:idHospedagem/:idQuarto', controller.deletar);

// Buscar todos os quartos vinculados a uma hospedagem
router.get('/por-hospedagem/:idHospedagem', controller.buscarQuartosPorHospedagem);

module.exports = router;