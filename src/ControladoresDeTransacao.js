const res = require('express/lib/response');
let bancodedados = require('./bancodedados');
let { saques, depositos, transferencias } = bancodedados
let numeroConta = 1
let saldo = 0





const depositarValor = (req, res) => {
    const { numeroConta, valor } = req.body
    if (!numeroConta || !valor) {
        res.status(400).json({ mensagem: "Todos os campos são obrigatórios" })
    }
    const buscarConta = bancodedados.contas.find((buscarConta) => {
        return buscarConta.numeroConta === Number(numeroConta);
    })
    if (!buscarConta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' })
    }
    if (valor >= 0) {
        buscarConta.saldo = Number(buscarConta.saldo) + valor
        depositos.push({
            data: new Date,
            numeroConta,
            valor
        })
        res.status(200).send()

    } else {
        return res.status(400).json({ mensagem: 'Valor obrigatariamente maior que 0' })
    }


}

const sacarValor = (req, res) => {
    const { numeroConta, valor, senha } = req.body

    if (!numeroConta || !valor || !senha) {
        res.status(400).json({ mensagem: "Todos os campos são obrigatórios" })
    }
    const buscarConta = bancodedados.contas.find((buscarConta) => {
        return buscarConta.numeroConta === Number(numeroConta);
    })
    if (!buscarConta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' })
    }
    if (valor > buscarConta.saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente!' })

    }
    if (buscarConta.senha == senha) {

        buscarConta.saldo = Number(buscarConta.saldo) - valor
        saques.push({
            data: new Date,
            numeroConta,
            valor
        })
        return res.status(203).send()
    } else {
        return res.status(403).json({ mensagem: 'Senha incorreta!' })
    }
}

const transferir = (req, res) => {
    const { numeroContaOrigem, numeroContaDestino, senhaContaOrigem, valor } = req.body
    if (!numeroContaOrigem || !valor || !numeroContaDestino || !senhaContaOrigem) {
        res.status(400).json({ mensagem: "Todos os campos são obrigatórios" })
    }
    const buscarContaOrigem = bancodedados.contas.find((buscarConta) => {
        return buscarConta.numeroConta === Number(numeroContaOrigem);
    })
    if (!buscarContaOrigem) {
        return res.status(404).json({ mensagem: 'Conta origem não encontrada' })
    }
    const buscarContaDestino = bancodedados.contas.find((buscarConta) => {
        return buscarConta.numeroConta === Number(numeroContaDestino);
    })
    if (!buscarContaDestino) {
        return res.status(404).json({ mensagem: 'Conta destino não encontrada' })
    }
    if (valor > buscarContaOrigem.saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente!' })

    }
    if (buscarContaOrigem.senha == senhaContaOrigem) {
        buscarContaOrigem.saldo = Number(buscarContaOrigem.saldo) - valor;
        buscarContaDestino.saldo = Number(buscarContaDestino.saldo) + valor
        transferencias.push({
            data: new Date,
            valor,
            numeroContaOrigem,
            numeroContaDestino
        })
        return res.status(203).send()
    } else {
        return res.status(403).json({ mensagem: 'Senha incorreta!' })
    }
}

const extrato = (req, res) => {
    const { numeroConta, senha } = req.query

    if (!numeroConta || !senha) {
        res.status(400).json({ mensagem: "Todos os campos são obrigatórios" })
    }
    const buscarConta = bancodedados.contas.find((buscarConta) => {
        return buscarConta.numeroConta === Number(numeroConta);
    })
    if (!buscarConta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' })
    }
    if (buscarConta.senha == senha) {

        return res.status(203).send({
            saques: saques.filter((item) => {
                return item.numeroConta == numeroConta
            }),
            depositos: depositos.filter((item) => {
                return item.numeroConta == numeroConta
            }),
            transferenciasEnviadas: transferencias.filter((item) => {
                return item.numeroContaOrigem == numeroConta
            }),
            transferenciasRecebidas: transferencias.filter((item) => {
                return item.numeroContaDestino == numeroConta
            })


        })
    } else {
        return res.status(403).json({ mensagem: 'Senha incorreta!' })
    }

}

module.exports = {
    depositarValor,
    sacarValor,
    transferir,
    extrato
}





