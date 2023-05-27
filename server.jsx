const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Configurar o diretório de build da aplicação React
app.use(express.static(path.join(__dirname, 'build')));

// Configurar a rota de fallback para sempre retornar o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Resto da configuração do servidor...

// Iniciar o servidor
app.listen(port, () => {
  console.log('Servidor iniciado na porta 3000');
});
