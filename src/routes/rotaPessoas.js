const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { validar, schemaPessoa } = require("../validation/validation");
const auth = require("../auth/authLogin");

// Rota principal listando as pessoas desaparecidas.
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      `
      SELECT * FROM pessoas ORDER BY criado_em DESC
      `,
    );
    res.status(200).json(resultado.rows);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar pessoas.",
    });
  }
});

// Rota para buscar uma pessoa pelo ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(`SELECT * FROM pessoas WHERE id = $1`, [
      id,
    ]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Pessoa não encontrada." });
    }
    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar pessoa." });
  }
});

// Rota para cadastrar uma pessoa desaparecida
router.post("/", validar(schemaPessoa), async (req, res) => {
  try {
    const {
      nome,
      idade,
      sexo,
      descricao,
      foto_url,
      cidade_desaparecimento,
      estado_desaparecimento,
      data_desaparecimento,
    } = req.body;

    const resultado = await pool.query(
      `INSERT INTO pessoas (nome, idade, sexo, descricao, foto_url, cidade_desaparecimento, estado_desaparecimento, data_desaparecimento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        nome,
        idade,
        sexo,
        descricao,
        foto_url,
        cidade_desaparecimento,
        estado_desaparecimento,
        data_desaparecimento,
      ],
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao cadastrar pessoa.",
    });
  }
});

// Rota de atualização dos dados de uma pessoa desaparecida. Atualização protegida por autenticação.
router.put("/:id", auth, validar(schemaPessoa), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      idade,
      sexo,
      descricao,
      foto_url,
      cidade_desaparecimento,
      estado_desaparecimento,
      data_desaparecimento,
    } = req.body;

    const resultado = await pool.query(
      `UPDATE pessoas SET
      nome=$1,
      idade=$2,
      sexo=$3,
      descricao=$4,
      foto_url=$5,
      cidade_desaparecimento=$6,
      estado_desaparecimento=$7,
      data_desaparecimento=$8
      
      WHERE id=$9 RETURNING *`,
      [
        nome,
        idade,
        sexo,
        descricao,
        foto_url,
        cidade_desaparecimento,
        estado_desaparecimento,
        data_desaparecimento,
        id,
      ],
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Pessoa não encontrada" });
    }
    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao atualizar pessoa." });
  }
});

// Rota para deletar os dados de uma pessoa desaparecida. Exclusão protegida por autenticação
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      `DELETE FROM pessoas WHERE id = $1 RETURNING *`,
      [id],
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Pessoa não encontrada." });
    }
    res.status(200).json({ mensagem: "Pessoa removida com sucesso." });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao excluir os dados da pessoa." });
  }
});

module.exports = router;
