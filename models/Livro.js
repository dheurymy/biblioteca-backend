const mongoose = require('mongoose');

const LivroSchema = new mongoose.Schema({
    titulo: 
    { type: String,
         required: true
    },
    autor: 
    { type: String,
        required: true 
    },
    editora: 
    { type: String, 
        required: true 
    },
    anoPublicacao: 
    { type: Number, 
        required: true 
    },
    genero:
    { type: String, 
        required: true 
    },
    isbn: 
    { type: String, 
        required: true, 
        unique: true 
    },
    localizacao: 
    { type: String, 
        required: true 
    },
    quantidade: 
    { type: Number, 
        required: true 
    },
    

});
const Livro = mongoose.model('Livro', LivroSchema);
module.exports = Livro;

