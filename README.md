# Canal de Ética - Backend

Sistema de backend para envio de e-mails do Canal de Ética usando Node.js e Express. Os e-mails são enviados em formato HTML com design profissional e incluem a logo da empresa.

## Como instalar e rodar

### 1. Instalar as dependências:

```bash
npm install
```

### 2. Configurar as credenciais:

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

- `GMAIL_USER`: Seu e-mail Gmail
- `GMAIL_APP_PASSWORD`: Sua senha de aplicativo (sem espaços)
- `TO_EMAIL`: E-mails que receberão as denúncias (separados por vírgula)
- `PORT`: Porta do servidor (padrão: 3000)

**Importante:** Use uma senha de aplicativo, não sua senha normal do Gmail!

Para criar uma senha de aplicativo:

1. Ative a verificação em duas etapas na sua conta Google
2. Acesse: https://myaccount.google.com/apppasswords
3. Gere uma senha de aplicativo

**Exemplo de `.env`:**

```env
GMAIL_USER=seu-email@gmail.com
GMAIL_APP_PASSWORD=sua-senha-de-aplicativo
TO_EMAIL=admin@empresa.com,rh@empresa.com
PORT=3000
```

### 3. Adicionar a logo (opcional):

Coloque o arquivo `logo.png` na raiz do projeto. Se não houver logo, o e-mail será enviado sem ela.

### 4. Iniciar o servidor:

```bash
npm start
```

O servidor estará rodando em: `http://localhost:3000`

### 5. Acessar o formulário:

Abra o arquivo `index.html` no navegador ou acesse: `http://localhost:3000`

## Estrutura do Projeto

- `server.js`: Servidor Express que processa os envios de e-mail
- `emailTemplate.js`: Template HTML e texto para os e-mails
- `index.html`: Formulário web para envio de denúncias
- `logo.png`: Logo da empresa (usada nos e-mails)
- `.env`: Configurações e credenciais (não commitado)
- `package.json`: Dependências do projeto

## Funcionalidades

- ✅ Envio de e-mails em formato HTML com design profissional
- ✅ Versão em texto plano como fallback para clientes antigos
- ✅ Suporte a múltiplos destinatários (separados por vírgula)
- ✅ Logo da empresa incluída automaticamente nos e-mails
- ✅ Validação de campos obrigatórios
- ✅ Tratamento de erros e logging

## API

### POST `/api/send-email`

Envia uma denúncia por e-mail.

**Body:**

```json
{
  "tipo_relato": "Assédio Moral",
  "identificacao": "on",
  "nome": "Nome do denunciante",
  "contato": "contato@email.com",
  "pessoas_envolvidas": "Nome das pessoas",
  "descricao": "Descrição do fato"
}
```

**Resposta de sucesso:**

```json
{
  "success": true,
  "message": "Denúncia enviada com sucesso!"
}
```

**Resposta de erro:**

```json
{
  "success": false,
  "message": "Erro ao enviar a denúncia. Tente novamente mais tarde.",
  "error": "Mensagem de erro detalhada"
}
```

### GET `/api/health`

Verifica se o servidor está funcionando.

**Resposta:**

```json
{
  "status": "OK",
  "message": "Servidor funcionando!"
}
```

## Dependências

- `express`: Framework web para Node.js
- `nodemailer`: Biblioteca para envio de e-mails
- `cors`: Middleware para habilitar CORS
- `dotenv`: Carregamento de variáveis de ambiente
