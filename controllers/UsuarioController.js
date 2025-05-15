const Usuario = require("../models/Usuario");

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

module.exports = { criarUsuario };