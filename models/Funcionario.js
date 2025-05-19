const mongoose = require('mongoose'); // Importa o módulo mongoose
const bcrypt = require('bcryptjs'); // Importa o módulo bcryptjs para hash de senhas
const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken para autenticação

const FuncionarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    telefone: {
        type: String,
        required: true,
    },
    senha: {
        type: String,
        required: true,
    },
   
});

// Função para hash da senha antes de salvar
FuncionarioSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('senha')) {
        user.senha = await bcrypt.hash(user.senha, 8);
    }
    next();
});

// Método para comparar senhas
FuncionarioSchema.methods.compareSenha = function (candidateSenha) {
    return bcrypt.compare(candidateSenha, this.senha);
};

// Método para gerar token JWT
FuncionarioSchema.methods.generateAuthToken = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};
module.exports = mongoose.model('Funcionario', FuncionarioSchema);

