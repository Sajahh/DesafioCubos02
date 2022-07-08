const express = require('express');
const bancodedados = require('./bancodedados');
const controladoresContas = require('./ControladoresDeContas')
const controladoresTransacao = require('./ControladoresDeTransacao')
const server = express();
server.use(express.json())
let { contas } = require('./bancodedados');
let numeroConta = 1
let saldo = 0



server.get('/contas', controladoresContas.listarContas)

server.post('/contas', controladoresContas.criarConta)

server.put('/contas/:numeroConta', controladoresContas.atualizarDados)

server.get('/contas/saldo/', controladoresContas.consultarSaldo)

server.delete('/contas/:numeroConta', controladoresContas.deletarConta)



server.post('/transacoes/depositar', controladoresTransacao.depositarValor)

server.post('/transacoes/sacar', controladoresTransacao.sacarValor,)

server.post('/transacoes/transferir', controladoresTransacao.transferir)

server.get('/contas/extrato', controladoresTransacao.extrato)







server.listen(3000);