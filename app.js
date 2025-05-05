const express = require('express');
const app = express();
const clienteRoutes = require('./routes/clienteRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

// Configurações básicas
app.use(express.json()); 

// Rota cliente
app.use('/clientes', clienteRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.send('API do Sistema de Hotelaria está no ar!');
});

// Rota reserva
app.use('/reservas', reservaRoutes);


// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
