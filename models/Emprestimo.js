const mongoose = require('mongoose');

const EmprestimoSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    funcionarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Funcionario',
        required: true,
    },
    livroId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Livro',
        required: true,
    },
    dataEmprestimo: {
        type: Date,
        required: true,
        default: Date.now,
    },
    dataDevolucaoPrevista: {
        type: Date,
        required: true,
    },
    dataDevolucaoReal: {
        type: Date,
    },
    multa: {
        type: Number,
        default: 0,
    }
});

const Emprestimo = mongoose.model('Emprestimo', EmprestimoSchema);
module.exports = Emprestimo;
