const mongoose = require('mongoose');
const EnderecoSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    logradouro: {
        type: String,
        required: true,
    },
    numero: {
        type: String,
        required: true,
    },
    complemento: {
        type: String,
        required: false,
    },
    bairro: {
        type: String,
        required: true,
    },
    cidade: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        required: true,
    },
    cep: {
        type: String,
        required: true,
    },
});

const Endereco = mongoose.model('Endereco', EnderecoSchema);
module.exports = Endereco;