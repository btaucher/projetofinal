# API Enchentes

## Sobre

API desenvolvida para auxiliar no gerenciamento de informações durante situações de enchentes.
O sistema centraliza dados sobre pessoas desaparecidas, permitindo o registro de avistamentos,
atualizações de status e contatos de familiares, facilitando a comunicação e aumentando as
chances de localização das vítimas.

## Funcionalidades

- Cadastro e consulta de pessoas desaparecidas
- Registro de contatos vinculados às pessoas desaparecidas
- Registro e consulta de avistamentos
- Histórico de status de cada pessoa (desaparecida, avistada, localizada, confirmada)
- Cadastro e autenticação de usuários com controle de acesso por papel (adm e voluntario)

## Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL
- JWT (JSON Web Token) — autenticação e controle de acesso
- Bcrypt — criptografia de senhas
- Joi — validação de dados
- Cors — controle de acesso entre origens
- Dotenv — gerenciamento de variáveis de ambiente

## Autenticação

As rotas protegidas exigem um token JWT no header da requisição no seguinte formato:

Authorization: Bearer {token}

O token é obtido realizando login na rota POST /usuario/login e tem validade de 1 hora.

## Rotas públicas (não requerem autenticação)

- POST /usuario/cadastro
- POST /usuario/login
- GET /pessoas
- GET /pessoas/:id
- POST /pessoas
- POST /registro
- GET /avistamento/:pessoa_id
- POST /avistamento
- GET /status/:pessoa_id

## Rotas protegidas (requerem autenticação)

- PUT /pessoas/:id
- DELETE /pessoas/:id
- GET /registro
- GET /registro/:pessoa_id
- DELETE /registro/:id
- DELETE /avistamento/:id
- POST /status

## Observações

- Ao deletar uma pessoa, todos os registros vinculados a ela (registro, avistamento e status)
  são removidos automaticamente pelo banco de dados.
- O campo "atualizado_por" no status é preenchido automaticamente com o ID do usuário
  autenticado que realizou a atualização.
- O histórico de status preserva todas as atualizações, permitindo acompanhar toda a
  linha do tempo de uma pessoa desaparecida.
