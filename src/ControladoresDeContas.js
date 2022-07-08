let bancodedados = require('./bancodedados');
let { contas } = bancodedados
let numeroConta = 1
let saldo = 0



const listarContas = (req, res) => {
    if (req.query.senha === bancodedados.banco.senha) {
        return res.send(contas)
    } else {
        return res.status(400).json({ mensagem: "A senha do banco informada é inválida!" })
    }
}

const criarConta = (req, res) => {

    const { nome, cpf, data_nascimento, telefone,
        email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        res.status(400).json({ mensagem: "Todos os campos são obrigatórios" })
    }
    const novaConta = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
        numeroConta: numeroConta++,
        saldo: saldo
    }

    contas.push(novaConta)
    return res.status(200).json({ mensagem: "Conta criada com sucesso!" })
}

const atualizarDados = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone,
        email, senha } = req.body;
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        res.status(400).json({ mensagem: "Todos os campos são obrigatórios" })
    }


    const novosDados = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
        numeroConta: Number(numeroConta),
        saldo: bancodedados.contas[numeroConta - 1].saldo
    }
    bancodedados.contas[numeroConta - 1] = novosDados
    return res.status(203).send()
}

const consultarSaldo = (req, res) => {
    const { numeroConta, senha } = req.query

    const buscarConta = bancodedados.contas.find((buscarConta) => {
        return buscarConta.numeroConta === Number(numeroConta);
    })
    if (!buscarConta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' })
    }

    if (buscarConta.senha === senha) {
        return res.status(200).json({ saldo: buscarConta.saldo })
    } else {
        return res.status(403).json({ mensagem: 'Senha incorreta!' })
    }


}

const deletarConta = (req, res) => {
    const { numeroConta } = req.params
    const buscarConta = bancodedados.contas.find((buscarConta) => {
        return buscarConta.numeroConta === Number(numeroConta);
    })
    if (!buscarConta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' })
    }

    contas = contas.filter((conta) => {
        return conta.numeroConta !== Number(numeroConta)

    })
    return res.status(204).send()

}


module.exports = {
    listarContas,
    criarConta,
    atualizarDados,
    consultarSaldo,
    deletarConta
}