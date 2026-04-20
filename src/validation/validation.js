const Joi = require("joi");

const schemaPessoa = Joi.object({
  nome: Joi.string().min(3).max(255).required().messages({
    "string.empty": "O nome é obrigatório.",
    "string.min": "O nome deve conter pelo menos 3 caracteres.",
    "string.max": "O nome deve conter no máximo 255 caracteres.",
    "any.required": "O nome é obrigatório.",
  }),
  idade: Joi.number().integer().min(0).max(120).messages({
    "number.base": "A idade deve ser um número.",
    "number.integer": "A idade deve ser um número inteiro.",
    "number.min": "A idade não pode ser negativa.",
    "number.max": "A idade deve ser no máximo 120 anos.",
  }),
  sexo: Joi.string().max(9).required().messages({
    "string.empty": "O sexo é obrigatório.",
    "any.required": "O sexo é obrigatório.",
  }),
  descricao: Joi.string().max(255).messages({
    "string.max": "A descrição deve conter no máximo 255 caracteres.",
  }),
  foto_url: Joi.string().max(255).messages({
    "string.max": "A URL da foto deve conter no máximo 255 caracteres.",
  }),
  cidade_desaparecimento: Joi.string().max(255).required().messages({
    "string.empty": "A cidade de desaparecimento é obrigatória.",
    "any.required": "A cidade de desaparecimento é obrigatória.",
  }),
  estado_desaparecimento: Joi.string().max(255).required().messages({
    "string.empty": "O estado de desaparecimento é obrigatório.",
    "any.required": "O estado de desaparecimento é obrigatório.",
  }),
  data_desaparecimento: Joi.date().required().messages({
    "date.base": "A data do desaparecimento deve ser uma data válida.",
    "any.required": "A data do desaparecimento é obrigatória.",
  }),
});

const schemaRegistro = Joi.object({
  pessoa_id: Joi.number().integer().required().messages({
    "number.base": "O pessoa_id deve ser um número.",
    "number.integer": "O pessoa_id deve ser um número inteiro.",
    "any.required": "O ID da pessoa_id é obrigatório.",
  }),
  nome_contato: Joi.string().min(3).max(255).required().messages({
    "string.empty": "O nome do contato é obrigatório.",
    "string.min": "O nome do contato deve conter pelo menos 3 caracteres.",
    "any.required": "O nome do contato é obrigatório",
  }),
  telefone_contato: Joi.string().max(20).required().messages({
    "string.empty": "O telefone de contato é obrigatório.",
    "any.required": "O telefone de contato é obrigatório.",
  }),
  email_contato: Joi.string().email().max(255).messages({
    "string.email": "O e-mail de contato deve ser válido.",
    "string.max": "O e-mail deve conter no máximo 255 caracteres.",
  }),
  relacao_com_pessoa: Joi.string().max(255).messages({
    "string.max":
      "A relação com a pessoa deve conter no máximo 255 caracteres.",
  }),
});

const schemaStatus = Joi.object({
  pessoa_id: Joi.number().integer().required().messages({
    "number.base": "O pessoa_id deve ser um número.",
    "number.integer": "O pessoa_id deve ser um número inteiro.",
    "any.required": "O ID da pessoa_id é obrigatório.",
  }),
  estado: Joi.string()
    .valid("desaparecida", "avistada", "localizada", "confirmada")
    .required()
    .messages({
      "any.only":
        "O estado deve ser: desaparecida, avistada, localizada ou confirmada.",
      "any.required": "O estado é obrigatório.",
    }),
  observacao: Joi.string().messages({
    "string.base": "A observação deve ser um texto.",
  }),
  atualizado_por: Joi.number().integer().messages({
    "number.base": "O atualizado_por deve ser um número.",
    "number.integer": "O atualizado_por deve ser um número inteiro.",
  }),
});

const schemaAvistamento = Joi.object({
  pessoa_id: Joi.number().integer().required().messages({
    "number.base": "O pessoa_id deve ser um número.",
    "number.integer": "O pessoa_id deve ser um número inteiro.",
    "any.required": "O ID da pessoa_id é obrigatório.",
  }),
  nome_informante: Joi.string().min(3).max(255).required().messages({
    "string.empty": "O nome do informante é obrigatório.",
    "string.min": "O nome do informante deve conter pelo menos 3 caracteres.",
    "any.required": "O nome do informante é obrigatório.",
  }),
  telefone_informante: Joi.string().max(20).required().messages({
    "string.empty": "O telefone do informante é obrigatório.",
    "any.required": "O telefone do informante é obrigatório.",
  }),
  local_avistamento: Joi.string().max(255).required().messages({
    "string.empty": "O local do avistamento é obrigatório.",
    "any.required": "O local do avistamento é obrigatório.",
  }),
  cidade: Joi.string().max(255).required().messages({
    "string.empty": "A cidade é obrigatória",
    "any.required": "A cidade é obrigatória",
  }),
  estado: Joi.string().max(20).required().messages({
    "string.empty": "O estado é obrigatório",
    "any.required": "O estado é obrigatório",
  }),
  data_avistamento: Joi.date().required().messages({
    "date.base": "A data do avistamento deve ser uma data válida.",
    "any.required": "A data do avistamento é obrigatória.",
  }),
  descricao: Joi.string().messages({
    "string.base": "A descrição deve ser um texto.",
  }),
});

const schemaUsuario = Joi.object({
  nome: Joi.string().min(3).max(255).required().messages({
    "string.empty": "O nome é obrigatório",
    "string.min": "O nome deve conter pelo menos 3 caracteres.",
    "any.required": "O nome é obrigatório.",
  }),
  email: Joi.string().email().max(255).required().messages({
    "string.email": "O e-mail do usuário deve ser válido.",
    "string.empty": "O e-mail do usuário é obrigatório",
    "any.required": "O e-mail do usuário é obrigatório.",
  }),
  senha: Joi.string().min(6).required().messages({
    "string.empty": "A senha é obrigatória.",
    "string.min": "A senha deve conter pelo menos 6 caracteres.",
    "any.required": "A senha é obrigatória",
  }),
  papel: Joi.string().valid("adm", "voluntario").required().messages({
    "any.only": "O papel deve ser: adm ou voluntario.",
    "any.required": "O papel é obrigatório.",
  }),
});

const schemaLogin = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "O e-mail informado não é válido.",
    "string.empty": "O e-mail é obrigatório para realizar o login.",
    "any.required": "O e-mail é obrigatório para realizar o login.",
  }),
  senha: Joi.string().required().messages({
    "string.empty": "A senha é obrigatória para realizar o login.",
    "any.required": "A senha é obrigatória para realizar o login.",
  }),
});

function validar(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        erros: error.details.map((e) => e.message),
      });
    }
    next();
  };
}

module.exports = {
  validar,
  schemaPessoa,
  schemaRegistro,
  schemaStatus,
  schemaAvistamento,
  schemaUsuario,
  schemaLogin,
};
