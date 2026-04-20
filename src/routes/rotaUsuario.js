const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const {
  validar,
  schemaUsuario,
  schemaLogin,
} = require("../validation/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Rota para cadastrar um novo usuário
router.post("/cadastro", validar(schemaUsuario), async (req, res) => {
  try {
    const { nome, email, senha, papel } = req.body;

    // Variável para verificar se o e-mail já está cadastrado
    const existente = await pool.query(
      `SELECT id FROM usuario WHERE email = $1`,
      [email],
    );
    if (existente.rows.length > 0) {
      return res.status(409).json({ mensagem: "E-mail já cadastrado." });
    }

    // Variável para criptografar a senha antes de salvar
    const senha_hash = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
      `INSERT INTO
      usuario (nome, email, senha_hash, papel)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nome, email, papel, criado_em`,
      [nome, email, senha_hash, papel],
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao cadastrar usuário." });
  }
});

// Rota para realizar o login, com retorno do token JWT
router.post("/login", validar(schemaLogin), async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Variável para verificar se o usuário existe.
    const resultado = await pool.query(
      `SELECT * FROM usuario WHERE email = $1`,
      [email],
    );
    if (resultado.rows.length === 0) {
      return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
    }

    const usuario = resultado.rows[0];

    // Variável para comparar se a senha enviada hash bate com a senha salva no banco.
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
    }

    // Variável para gerar o token JWT com os dados do usuário
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, papel: usuario.papel },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao realizar o login." });
  }
});

module.exports = router;
