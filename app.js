const express = require('express');
const cors = require('cors'); // <- Importação do CORS
const app = express();
require('dotenv').config();

// Habilita o CORS
app.use(cors()); 
app.use(express.json()); 

// Importação das rotas
const clienteRoutes = require('./routes/clienteRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const quartoRoutes = require('./routes/quartoRoutes');
const tipoQuartoRoutes = require('./routes/tipoQuartoRoutes');
const hospedagemRoutes = require('./routes/hospedagemRoutes');
const comodidadeRoutes = require('./routes/comodidadeRoutes');
const hospedagemQuartoRoutes = require('./routes/hospedagemQuartoRoutes');
const tipoQuartoComodidadeRoutes = require('./routes/tipoQuartoComodidadeRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const telefoneRoutes = require('./routes/telefoneRoutes');
const authRoutes = require('./routes/authRoutes');

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota principal
app.get('/', (req, res) => {
  res.send('API do Sistema de Hotelaria está no ar!');
});

// Rotas
app.use('/api/clientes', clienteRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/quartos', quartoRoutes);
app.use('/api/tipoquartos', tipoQuartoRoutes);
app.use('/api/hospedagens', hospedagemRoutes);
app.use('/api/comodidades', comodidadeRoutes);
app.use('/api/hospedagemquartos', hospedagemQuartoRoutes);
app.use('/api/tipoquartoscomodidades', tipoQuartoComodidadeRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/telefones', telefoneRoutes);
app.use('/api/auth', authRoutes);
