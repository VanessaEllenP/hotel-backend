const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

router.get('/', reservaController.listar);
router.get('/:id', reservaController.buscarPorId);
router.post('/', reservaController.criar);
router.put('/:id', reservaController.atualizar);
router.delete('/:id', reservaController.deletar);

module.exports = router;
