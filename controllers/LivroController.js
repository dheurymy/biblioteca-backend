const Livro = require('../models/Livro');
const Emprestimo = require('../models/Emprestimo');

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

const alterarQuantidadeLivro = async (req, res) => {
    try {
        const { isbn, novaQuantidade } = req.body;

        // Verifica se o livro existe
        const livro = await Livro.findOne({ isbn });
        if (!livro) {
            return res.status(404).json({ mensagem: 'Livro não encontrado.' });
        }

        // Atualiza a quantidade do livro
        livro.quantidade = novaQuantidade;
        await livro.save();

        res.status(200).json({ mensagem: 'Quantidade de livros atualizada com sucesso.', livro });
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao atualizar quantidade do livro.', erro });
    }
};

const buscarLivroIsbn = async (req, res) => {
    try {
        const { isbn } = req.params;

        // Busca o livro pelo ISBN no banco de dados
        const livro = await Livro.findOne({ isbn });

        if (!livro) {
            return res.status(404).json({ mensagem: 'Livro não encontrado.' });
        }

        res.status(200).json({ livro });
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao buscar livro.', erro });
    }
};

const emprestarLivro = async (req, res) => {
    try {
        const { isbn } = req.params;

        // Verifica se o livro existe
        const livro = await Livro.findOne({ isbn });

        if (!livro) {
            return res.status(404).json({ mensagem: 'Livro não encontrado.' });
        }

        // Verifica se há exemplares disponíveis
        if (livro.quantidade <= 1) {
            return res.status(400).json({ mensagem: 'Nenhum exemplar disponível para empréstimo.' });
        }

        // Atualiza a quantidade
        livro.quantidade -= 1;
        await livro.save();

        res.status(200).json({ mensagem: 'Livro emprestado com sucesso.', livro });
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao emprestar livro.', erro });
    }
};

const devolverLivro = async (req, res) => {
    try {
        const { isbn } = req.params;

        // Verifica se o livro existe
        const livro = await Livro.findOne({ isbn });

        if (!livro) {
            return res.status(404).json({ mensagem: 'Livro não encontrado.' });
        }

        // Incrementa a quantidade
        livro.quantidade += 1;
        await livro.save();

        res.status(200).json({ mensagem: 'Livro devolvido com sucesso.', livro });
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao devolver livro.', erro });
    }
};

const listarLivrosMaisEmprestados = async (req, res) => {
    try {
        const ranking = await Emprestimo.aggregate([
            {
                $group: {
                    _id: "$livroId",
                    totalEmprestimos: { $sum: 1 }
                }
            },
            {
                $sort: { totalEmprestimos: -1 }
            },
            {
                $lookup: {
                    from: "livros",
                    localField: "_id",
                    foreignField: "_id",
                    as: "livro"
                }
            },
            {
                $unwind: "$livro"
            },
            {
                $project: {
                    _id: 0,
                    titulo: "$livro.titulo",
                    autor: "$livro.autor",
                    isbn: "$livro.isbn",
                    totalEmprestimos: 1
                }
            }
        ]);

        res.status(200).json({ livrosMaisEmprestados: ranking });
    } catch (erro) {
        console.error("Erro ao listar livros mais emprestados:", erro.message);
        res.status(500).json({ mensagem: 'Erro ao listar livros mais emprestados.', erro });
    }
};

const verificarQuantidadeLivros = async (req, res) => {
    try {
        const { isbn } = req.params;

        // Busca o livro pelo ISBN
        const livro = await Livro.findOne({ isbn });
        if (!livro) {
            return res.status(404).json({ mensagem: 'Livro não encontrado.' });
        }

        // Busca a quantidade de empréstimos ativos para o livro
        const emprestimosAtivos = await Emprestimo.find({ livroId: livro._id,  dataDevolucaoReal: { $exists: false }});

        res.status(200).json({
            titulo: livro.titulo,
            autor: livro.autor,
            isbn: livro.isbn,
            quantidadeDisponivel: livro.quantidade,
            quantidadeEmprestada: emprestimosAtivos.length,
            mensagem: emprestimosAtivos.length 
                ? `Existem ${emprestimosAtivos.length} exemplares emprestados deste livro.` 
                : "Nenhum exemplar emprestado no momento."
        });
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao verificar quantidade de livros e empréstimos.', erro });
    }
};




module.exports = {
    criarLivro, 
    buscarLivros,
    alterarQuantidadeLivro,
    buscarLivroIsbn,
    emprestarLivro,
    devolverLivro,
    listarLivrosMaisEmprestados,
    verificarQuantidadeLivros
};