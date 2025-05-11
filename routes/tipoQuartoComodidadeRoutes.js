const express = require('express');
const router = express.Router();
const controller = require('../controllers/tipoQuartoComodidadeController');

router.get('/', controller.listar);
router.post('/', controller.criar);
router.delete('/:idTipoQuarto/:idComodidade', controller.deletar);
router.get('/por-tipoquarto/:idTipoQuarto', controller.buscarPorTipoQuarto);

module.exports = router;
