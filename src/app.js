require("dotenv").config();
const express = require("express");
const cors = require("cors");

const rotaPessoas = require("./routes/rotaPessoas");
const rotaRegistro = require("./routes/rotaRegistro");
const rotaStatus = require("./routes/rotaStatus");
const rotaAvistamento = require("./routes/rotaAvistamento");
const rotaUsuario = require("./routes/rotaUsuario");

const app = express();
app.use(cors());
app.use(express.json());

function dataFormatada(data) {
  return new Date(data).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
}

app.use("/pessoas", rotaPessoas);
app.use("/registro", rotaRegistro);
app.use("/status", rotaStatus);
app.use("/avistamento", rotaAvistamento);
app.use("/usuario", rotaUsuario);

module.exports = app;
