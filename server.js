const express = require('express'); // Importa o módulo express para criar o servidor
const mongoose = require('mongoose'); // Importa o módulo mongoose para interagir com o MongoDB
const cors = require('cors'); // Importa o módulo cors para permitir requisições de diferentes origens
const dotenv = require('dotenv'); // Importa o módulo dotenv para gerenciar variáveis de ambiente
const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken para criar e verificar tokens JWT
const bcrypt = require('bcryptjs'); // Importa o módulo bcrypt para hash de senhas

const Usuario = require('./models/Usuario'); // Importa o modelo de Usuário
const UsuarioController = require('./controllers/UsuarioController'); // Importa o controlador de Usuário

const Endereco = require('./models/Endereco'); // Importa o modelo de Endereço
const EnderecoController = require('./controllers/EnderecoControler'); // Importa o controlador de Endereço


dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express(); // Cria uma instância do aplicativo Express
const PORT = process.env.PORT || 5000; // Define a porta do servidor a partir da variável de ambiente ou usa 5000 como padrão
const MONGO_URI = process.env.MONGO_URI; // Obtém a URI de conexão do MongoDB a partir da variável de ambiente


const corsOptions = {
    origin: '*', // Permite requisições de qualquer origem )
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
};

app.use(cors(corsOptions));
app.use(express.json()); // Utiliza o middleware para parsear o corpo das requisições como JSON

app.use((req, res, next) => { 
  res.setHeader('Cross-Origin-Opener-Policy', 'no-cors'); 
  next(); 
});

// Conexão com MongoDB com opções recomendadas
mongoose.connect(MONGO_URI)
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err.message));

app.get('/', (req, res) => {
  res.send(' API da Biblioteca de Ohara funcionando a todo vapor!');
});

// Rotas para Usuário
app.post('/usuarios', UsuarioController.criarUsuario);
app.post('/usuarios/login', UsuarioController.loginUsuario);

// Rotas para Endereço
app.post('/enderecos', EnderecoController.criarEndereco);


app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});