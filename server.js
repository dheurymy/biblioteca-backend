const express = require('express'); // Importa o módulo express para criar o servidor
const mongoose = require('mongoose'); // Importa o módulo mongoose para interagir com o MongoDB
const cors = require('cors'); // Importa o módulo cors para permitir requisições de diferentes origens
const dotenv = require('dotenv'); // Importa o módulo dotenv para gerenciar variáveis de ambiente
const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken para criar e verificar tokens JWT
const bcrypt = require('bcryptjs'); // Importa o módulo bcrypt para hash de senhas

const Usuario = require('./models/Usuario'); // Importa o modelo de Usuário
const UsuarioController = require('./controllers/UsuarioController'); // Importa o controlador de Usuário

const Funcionario = require('./models/Funcionario'); // Importa o modelo de Funcionário
const FuncionarioController = require('./controllers/FuncionarioController'); // Importa o controlador de Funcionário


const Endereco = require('./models/Endereco'); // Importa o modelo de Endereço
const EnderecoController = require('./controllers/EnderecoControler'); // Importa o controlador de Endereço

const Livro = require('./models/Livro'); // Importa o modelo de Livro
const LivroController = require('./controllers/LivroController'); // Importa o controlador de Livro

const Emprestimo = require('./models/Emprestimo');
const EmprestimoController = require('./controllers/EmprestimoController');


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
app.post('/usuarios/verifica', UsuarioController.verificarUsuarioCPF);
app.put('/usuarios/:id',UsuarioController.atualizarUsuario);

// Rotas para Funcionario
app.post('/funcionarios', FuncionarioController.criarFuncionario);
app.post('/funcionarios/login', FuncionarioController.loginFuncionario);
app.post('/funcionarios/verifica', FuncionarioController.verificarFuncionarioCPF);

// Rotas para Endereço
app.post('/enderecos', EnderecoController.criarEndereco);
app.put('/enderecos/:usuarioId', EnderecoController.atualizarEndereco);

//Rotas para Livro
app.post('/livros', LivroController.criarLivro);
app.get('/livros', LivroController.buscarLivros);
app.put('/livros/emprestar/:isbn', LivroController.emprestarLivro);
app.put('/livros/devolver/:isbn', LivroController.devolverLivro);
app.get('/livros/mais-emprestados', LivroController.listarLivrosMaisEmprestados);
app.put('/livros/quantidade', LivroController.alterarQuantidadeLivro);
app.get('/livros/:isbn', LivroController.buscarLivroIsbn);
app.get('/livros/quantidade/:isbn', LivroController.verificarQuantidadeLivros);
//Rotas para Emprestimo
app.post('/emprestimos', EmprestimoController.criarEmprestimo);
app.put('/emprestimos/finalizar/:id', EmprestimoController.finalizarEmprestimo);
app.get('/emprestimos/pendentes', EmprestimoController.listarEmprestimosPendentes);
app.get('/emprestimos/atrasados', EmprestimoController.listarEmprestimosAtrasados);
app.get('/emprestimos/:id', EmprestimoController.listarEmprestimosId);
app.get('/emprestimos-pendentes/:cpf', EmprestimoController.obterEmprestimosPendentesPorCPF);
//oi
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});