const express = require('express');
const app = express();
require('dotenv').config();
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

// Configurações básicas
app.use(express.json()); 

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota principal
app.get('/', (req, res) => {
res.send('API do Sistema de Hotelaria está no ar!');
});

// Rota Clientes
app.use('/api/clientes', clienteRoutes);

// Rota Reservas
app.use('/api/reservas', reservaRoutes);

// Rota Quartos
app.use('/api/quartos', quartoRoutes);

// Rota Tipo Quartos
app.use('/api/tipoquartos', tipoQuartoRoutes);

// Rota Hospedagens
app.use('/api/hospedagens', hospedagemRoutes);

// Rota Comodidades 
app.use('/api/comodidades', comodidadeRoutes);

// Rota Hospedagem-Quarto 
app.use('/api/hospedagemquartos', hospedagemQuartoRoutes);

// Rota Tipo Quartos-Comodidades
app.use('/api/tipoquartoscomodidades', tipoQuartoComodidadeRoutes);

// Rota Funcionários
app.use('/api/funcionarios', funcionarioRoutes);

// Rota Telefone
app.use('/api/telefones', telefoneRoutes);

// Rota Autenticação
app.use('/api/auth', authRoutes);
