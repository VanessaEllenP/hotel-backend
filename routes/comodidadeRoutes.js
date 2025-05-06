const express = require('express');
const router = express.Router();
const comodidadeController = require('../controllers/comodidadeController');

router.get('/', comodidadeController.listarComodidades);

module.exports = router;
