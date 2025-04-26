const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;
const DB_FILE = "cadastros.json";

app.use(express.json());

function carregarDados() {
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "[]");
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function salvarDados(dados) {
  fs.writeFileSync(DB_FILE, JSON.stringify(dados, null, 2));
}

app.get("/cadastros", (req, res) => {
  const dados = carregarDados();
  res.json(dados);
});

app.get("/cadastros/busca", (req, res) => {
  const { cidade, idade } = req.query;
  const dados = carregarDados();
  const resultado = dados.filter(
    (p) => (!cidade || p.cidade === cidade) && (!idade || p.idade == idade)
  );
  res.json(resultado);
});

app.post("/cadastros", (req, res) => {
  const { nome, idade, cidade } = req.body;
  if (!nome || !idade || !cidade)
    return res.status(400).send("Dados incompletos");
  const dados = carregarDados();
  dados.push({ nome, idade, cidade });
  salvarDados(dados);
  res.status(201).send("Cadastro adicionado");
});

app.delete("/cadastros/:nome", (req, res) => {
  const nome = req.params.nome;
  const dados = carregarDados();
  const novos = dados.filter((p) => p.nome !== nome);
  if (novos.length === dados.length)
    return res.status(404).send("Cadastro não encontrado");
  salvarDados(novos);
  res.send("Cadastro removido");
});

app.listen(PORT, () =>
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
);
