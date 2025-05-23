const Usuario = require("../models/Usuario");
const Endereco = require("../models/Endereco");
const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken para autenticação
const bcrypt = require("bcryptjs");


const criarUsuario = async (req, res) => {
    try {
        const { nome, cpf, email, telefone, senha, tipoUsuario } = req.body;

        // Verifica se o email ou CPF já existem
        const usuarioExistente = await Usuario.findOne({ $or: [{ email }, { cpf }] });

        if (usuarioExistente) {
            return res.status(400).json({ mensagem: "Email ou CPF já cadastrados." });
        }

        // Cria um novo usuário
        const novoUsuario = new Usuario({ nome, cpf, email, telefone, senha, tipoUsuario });
        await novoUsuario.save();

        res.status(201).json({ usuario: novoUsuario });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao criar usuário.", erro });
    }
};




const loginUsuario = async (req, res) => {
    try {
        const { cpf, senha } = req.body;

        // Verifica se o usuário existe pelo CPF
        const usuario = await Usuario.findOne({ cpf });

        if (!usuario) {
            return res.status(400).json({ mensagem: "Usuário não encontrado." });
        }

        // Verifica se a senha informada está correta
        const senhaCorreta = await usuario.compareSenha(senha);
        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: "Senha inválida." });
        }

        const endereco = await Endereco.findOne({ usuarioId: usuario._id });


        // Gera token JWT
        const token = usuario.generateAuthToken();

        // Remove a senha antes de retornar os dados do usuário
        const { senha: _, ...dadosUsuario } = usuario.toObject();

       


        res.status(200).json({ 
            mensagem: "Login realizado com sucesso!", 
            token,
            usuario: dadosUsuario,
            endereco
        });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao realizar login.", erro });
    }
};

const verificarUsuarioCPF = async (req, res) => {
    try {
        const { cpf } = req.body;

        

        const usuarioExiste = await Usuario.exists({ cpf });

        return res.status(200).json({ existeUsuario: usuarioExiste ? true : false });

    } catch (erro) {
        res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
};

const atualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, cpf, email, telefone, senha, tipoUsuario } = req.body;

        // Verifica se o usuário existe
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        // Verifica se o novo email ou CPF já estão em uso por outro usuário
        const usuarioExistente = await Usuario.findOne({
            $or: [{ email }, { cpf }],
            _id: { $ne: id }
        });

        if (usuarioExistente) {
            return res.status(400).json({ mensagem: "Email ou CPF já cadastrados por outro usuário." });
        }

        // Atualiza os campos
        usuario.nome = nome ?? usuario.nome;
        usuario.cpf = cpf ?? usuario.cpf;
        usuario.email = email ?? usuario.email;
        usuario.telefone = telefone ?? usuario.telefone;
        usuario.senha = senha ?? usuario.senha;
        usuario.tipoUsuario = tipoUsuario ?? usuario.tipoUsuario;

        await usuario.save();

        res.status(200).json({ mensagem: "Usuário atualizado com sucesso.", usuario });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao atualizar usuário.", erro });
    }
};








module.exports = { criarUsuario, loginUsuario, verificarUsuarioCPF, atualizarUsuario};