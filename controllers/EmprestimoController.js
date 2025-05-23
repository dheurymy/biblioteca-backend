const Usuario = require('../models/Usuario');
const Funcionario = require('../models/Funcionario');
const Livro = require('../models/Livro');
const Emprestimo = require('../models/Emprestimo');

const criarEmprestimo = async (req, res) => {
    try {
        const { cpfUsuario, cpfFuncionario, isbnLivro, dataEmprestimo, dataDevolucaoPrevista } = req.body;

        // Verifica se o usuário existe
        const usuario = await Usuario.findOne({ cpf: cpfUsuario });
        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        // Verifica se o funcionário existe
        const funcionario = await Funcionario.findOne({ cpf: cpfFuncionario });
        if (!funcionario) {
            return res.status(404).json({ mensagem: "Funcionário não encontrado." });
        }

        // Verifica se o livro existe e tem exemplares disponíveis
        const livro = await Livro.findOne({ isbn: isbnLivro });
        if (!livro) {
            return res.status(404).json({ mensagem: "Livro não encontrado." });
        }

        if (livro.quantidade <= 1) {
            return res.status(400).json({ mensagem: "Nenhum exemplar disponível para empréstimo." });
        }

        // Atualiza a quantidade do livro
        livro.quantidade -= 1;
        await livro.save();

        // Cria o empréstimo
        const novoEmprestimo = await Emprestimo.create({
            usuarioId: usuario._id,
            funcionarioId: funcionario._id,
            livroId: livro._id,
            dataEmprestimo,
            dataDevolucaoPrevista
        });

        res.status(201).json({ mensagem: "Empréstimo registrado com sucesso.", emprestimo: novoEmprestimo });
    } catch (erro) {
        console.error("Erro ao criar empréstimo:", erro.message);
        res.status(500).json({ mensagem: "Erro ao criar empréstimo.", erro });
    }
};



const finalizarEmprestimo = async (req, res) => {
    try {
        const { id } = req.params; // ID do empréstimo

        // Busca o empréstimo
        const emprestimo = await Emprestimo.findById(id).populate('livroId');
        if (!emprestimo) {
            return res.status(404).json({ mensagem: 'Empréstimo não encontrado.' });
        }

        // Verifica se já foi finalizado
        if (emprestimo.dataDevolucaoReal) {
            return res.status(400).json({ mensagem: 'Este empréstimo já foi finalizado.' });
        }

        // Define a data de devolução real como agora
        const dataAtual = new Date();
        emprestimo.dataDevolucaoReal = dataAtual;

        // Calcula multa se houver atraso
        const atrasoDias = Math.ceil((dataAtual - emprestimo.dataDevolucaoPrevista) / (1000 * 60 * 60 * 24));
        if (atrasoDias > 0) {
            const valorMultaPorDia = 1; // Exemplo: R$2 por dia de atraso
            emprestimo.multa = atrasoDias * valorMultaPorDia;
        }

        // Atualiza a quantidade do livro
        const livro = await Livro.findById(emprestimo.livroId._id);
        livro.quantidade += 1;
        await livro.save();

        await emprestimo.save();

        res.status(200).json({
            mensagem: 'Empréstimo finalizado com sucesso.',
            emprestimo
        });
    } catch (erro) {
        console.error("Erro ao finalizar empréstimo:", erro.message);
        res.status(500).json({ mensagem: 'Erro ao finalizar empréstimo.', erro });
    }
};



const listarEmprestimosPendentes = async (req, res) => {
    try {
        const emprestimosPendentes = await Emprestimo.find({ dataDevolucaoReal: null })
            .populate('usuarioId', 'nome cpf')
            .populate('funcionarioId', 'nome cpf')
            .populate('livroId', 'titulo isbn');

        res.status(200).json({ emprestimos: emprestimosPendentes });
    } catch (erro) {
        console.error("Erro ao listar empréstimos pendentes:", erro.message);
        res.status(500).json({ mensagem: 'Erro ao listar empréstimos pendentes.', erro });
    }
};

const listarEmprestimosAtrasados = async (req, res) => {
    try {
        const hoje = new Date();

        const emprestimosAtrasados = await Emprestimo.find({
            dataDevolucaoReal: null,
            dataDevolucaoPrevista: { $lt: hoje }
        })
        .populate('usuarioId', 'nome cpf')
        .populate('funcionarioId', 'nome cpf')
        .populate('livroId', 'titulo isbn');

        res.status(200).json({ emprestimos: emprestimosAtrasados });
    } catch (erro) {
        console.error("Erro ao listar empréstimos atrasados:", erro.message);
        res.status(500).json({ mensagem: 'Erro ao listar empréstimos atrasados.', erro });
    }
};











module.exports = {
    criarEmprestimo,
    finalizarEmprestimo,
    listarEmprestimosPendentes,
    listarEmprestimosAtrasados
   

   
};