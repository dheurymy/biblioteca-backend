const Funcionario = require("../models/Funcionario");
const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken para autenticação
const bcrypt = require("bcryptjs");


const criarFuncionario = async (req, res) => {
    try {
        const { nome, cpf, email, telefone, senha } = req.body;

        // Verifica se o email ou CPF já existem
        const FuncionarioExistente = await Funcionario.findOne({ $or: [{ email }, { cpf }] });

        if (FuncionarioExistente) {
            return res.status(400).json({ mensagem: "Email ou CPF já cadastrados." });
        }

        // Cria um novo Funcionário
        const novoFuncionario = new Funcionario({ nome, cpf, email, telefone, senha});
        await novoFuncionario.save();

        res.status(201).json({ Funcionario: novoFuncionario });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao criar Funcionário.", erro });
    }
};




const loginFuncionario = async (req, res) => {
    try {
        const { cpf, senha } = req.body;

        // Verifica se o Funcionário existe pelo CPF
        const funcionario = await Funcionario.findOne({ cpf });
        if (!funcionario) {
            return res.status(400).json({ mensagem: "Funcionário não encontrado." });
        }

        // Verifica se a senha informada está correta
        const senhaCorreta = await funcionario.compareSenha(senha);
        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: "Senha inválida." });
        }

        // Gera token JWT
        const token = funcionario.generateAuthToken();

        // Remove a senha antes de retornar os dados do Funcionário
        const { senha: _, ...dadosFuncionario } = funcionario.toObject();

        res.status(200).json({ 
            mensagem: "Login realizado com sucesso!", 
            token,
            funcionario: dadosFuncionario 
        });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao realizar login.", erro });
    }
};

const verificarFuncionarioCPF = async (req, res) => {
    try {
        const { cpf } = req.body;

        

        const funcionarioExiste = await Funcionario.exists({ cpf });

        return res.status(200).json({ existeFuncionario: funcionarioExiste ? true : false });

    } catch (erro) {
        res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
};





module.exports = { criarFuncionario, loginFuncionario, verificarFuncionarioCPF };