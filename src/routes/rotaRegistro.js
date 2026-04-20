const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { validar, schemaRegistro } = require("../validation/validation");
const auth = require("../auth/authLogin");

// Rota para listar todos os registros de contato
router.get("/", auth, async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT * FROM registro ORDER BY criado_em DESC`,
    );
    res.status(200).json(resultado.rows);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar registros." });
  }
});

// Rota para buscar o contato de uma pessoa específica pelo pessoa_id
router.get("/:pessoa_id", auth, async (req, res) => {
  try {
    const { pessoa_id } = req.params;
    const resultado = await pool.query(
      `SELECT * FROM registro WHERE pessoa_id = $1`,
      [pessoa_id],
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Registro não encontrado." });
    }
    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar registro." });
  }
});

// Rota para criar um novo registro de contato para uma pessoa
router.post("/", validar(schemaRegistro), async (req, res) => {
  try {
    const {
      pessoa_id,
      nome_contato,
      telefone_contato,
      email_contato,
      relacao_com_pessoa,
    } = req.body;

    const resultado = await pool.query(
      `INSERT INTO registro (pessoa_id, nome_contato, telefone_contato, email_contato, relacao_com_pessoa) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        pessoa_id,
        nome_contato,
        telefone_contato,
        email_contato,
        relacao_com_pessoa,
      ],
    );
    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao criar registro." });
  }
});

// Rota para remover um registro, essa rota é protegita por autenticação.
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      `DELETE FROM registro WHERE id = $1 RETURNING *`,
      [id],
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Registro não encontrado." });
    }
    res.status(200).json({ mensagem: "Registro excluido com sucesso." });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao excluir registro." });
  }
});

module.exports = router;
