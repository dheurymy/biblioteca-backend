const Livro = require('../models/Livro');

// Função para criar um novo livro
const criarLivro = async (req, res) => {
    try {
        const { titulo, autor, editora, anoPublicacao, genero, isbn, localizacao, quantidade } = req.body;

        // Verifica se o livro já existe
        const livroExistente = await Livro.findOne({ isbn });
        if (livroExistente) {
            return res.status(400).json({ mensagem: 'Livro já cadastrado.' });
        }

        // Cria um novo livro
        const novoLivro = new Livro({ titulo, autor, editora, anoPublicacao, genero,isbn, localizacao, quantidade });
        await novoLivro.save();

        res.status(201).json({ livro: novoLivro });
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao criar livro.', erro });
    }
};

//Função para buscar todos os livros
const buscarLivros = async (req, res) => {
    try {
        const livros = await Livro.find();
        res.status(200).json({ livros });
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao buscar livros.', erro });
    }
};


module.exports = {
    criarLivro, 
    buscarLivros
};