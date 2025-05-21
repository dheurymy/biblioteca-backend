const Endereco = require('../models/Endereco');
const Usuario = require('../models/Usuario');

const criarEndereco = async (req, res) => {
    try {
        const { usuarioId, logradouro, numero, complemento, bairro, cidade, estado, cep } = req.body;

        // Verifica se o usuário existe
        const enderecoExistente = await Endereco.findOne({ usuarioId });

        if (enderecoExistente) {
            return res.status(400).json({ mensagem: "Endereço já cadastrado para este usuário." });
        }

        const usuarioExiste = await Usuario.findById(usuarioId);

        if (!usuarioExiste) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        

        // Cria um novo endereço
        const novoEndereco = await Endereco.create({ usuarioId, logradouro, numero, complemento, bairro, cidade, estado, cep });
        await novoEndereco.save();

        res.status(201).json({ endereco: novoEndereco });
    } catch (erro) {
        console.error("Erro ao criar endereço:", erro.message);

        res.status(500).json({ mensagem: "Erro ao criar endereço.", erro });
    }
};


const atualizarEndereco = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const { logradouro, numero, complemento, bairro, cidade, estado, cep } = req.body;

        // Verifica se o endereço existe para o usuário
        const endereco = await Endereco.findOne({ usuarioId });

        if (!endereco) {
            return res.status(404).json({ mensagem: "Endereço não encontrado para este usuário." });
        }

        // Atualiza os campos fornecidos
        endereco.logradouro = logradouro ?? endereco.logradouro;
        endereco.numero = numero ?? endereco.numero;
        endereco.complemento = complemento ?? endereco.complemento;
        endereco.bairro = bairro ?? endereco.bairro;
        endereco.cidade = cidade ?? endereco.cidade;
        endereco.estado = estado ?? endereco.estado;
        endereco.cep = cep ?? endereco.cep;

        await endereco.save();

        res.status(200).json({ mensagem: "Endereço atualizado com sucesso.", endereco });
    } catch (erro) {
        console.error("Erro ao atualizar endereço:", erro.message);
        res.status(500).json({ mensagem: "Erro ao atualizar endereço.", erro });
    }
};



module.exports = {
    criarEndereco,
    atualizarEndereco
};