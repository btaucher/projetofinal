const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { validar, schemaAvistamento } = require("../validation/validation");
const auth = require("../auth/authLogin");

// Rota para listar o histórico de avistamentos de uma pessoa
router.get("/:pessoa_id", async (req, res) => {
  try {
    const { pessoa_id } = req.params;
    const resultado = await pool.query(
      `SELECT * FROM avistamento WHERE pessoa_id = $1 ORDER BY data_avistamento DESC`,
      [pessoa_id],
    );
    res.status(200).json(resultado.rows);
  } catch (error) {
    res.status(500).json("Erro ao buscar o histórico de avistamentos.");
  }
});

// Rota para registrar um novo avistamento
router.post("/", validar(schemaAvistamento), async (req, res) => {
  try {
    const {
      pessoa_id,
      nome_informante,
      telefone_informante,
      local_avistamento,
      cidade,
      estado,
      data_avistamento,
      descricao,
    } = req.body;

    const resultado = await pool.query(
      `INSERT INTO avistamento (pessoa_id, nome_informante, telefone_informante, local_avistamento, cidade, estado, data_avistamento, descricao) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        pessoa_id,
        nome_informante,
        telefone_informante,
        local_avistamento,
        cidade,
        estado,
        data_avistamento,
        descricao,
      ],
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao criar avistamento." });
  }
});

// Rota para excluir um avistamento, essa rota é protegida por autenticação.
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      `DELETE FROM avistamento WHERE id = $1 RETURNING *`,
      [id],
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Avistamento não encontrado." });
    }
    res.status(200).json({ mensagem: "Avistamento excluido com sucesso." });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao excluir avistamento." });
  }
});

module.exports = router;
