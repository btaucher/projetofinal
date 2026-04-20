const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { validar, schemaStatus } = require("../validation/validation");
const auth = require("../auth/authLogin");

// Rota para listar o histórico de status de uma pessoa
router.get("/:pessoa_id", async (req, res) => {
  try {
    const { pessoa_id } = req.params;
    const resultado = await pool.query(
      `SELECT * FROM status WHERE pessoa_id = $1 ORDER BY criado_em DESC`,
      [pessoa_id],
    );
    res.status(200).json(resultado.rows);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar histórico de status" });
  }
});

// Rota para criar um novo status para uma pessoa desaparecida. Rota protegida por autenticação.
router.post("/", auth, validar(schemaStatus), async (req, res) => {
  try {
    const { pessoa_id, estado, observacao } = req.body;

    /* Essa variável está pegando o ID do usuário logado diretamente do token */
    const atualizado_por = req.usuario.id;

    const resultado = await pool.query(
      `INSERT INTO status (pessoa_id, estado, observacao, atualizado_por) VALUES ($1, $2, $3, $4) RETURNING *`,
      [pessoa_id, estado, observacao, atualizado_por],
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao criar status." });
  }
});

module.exports = router;
