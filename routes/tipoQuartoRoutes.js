const express = require('express');
const router = express.Router();
const tipoQuartoController = require('../controllers/tipoQuartoController');

router.get('/', tipoQuartoController.listarTodos);
router.get('/:id', tipoQuartoController.buscarPorId);
router.post('/', tipoQuartoController.criar);
router.put('/:id', tipoQuartoController.atualizar);
router.delete('/:id', tipoQuartoController.deletar);

module.exports = router;
