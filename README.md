# Canal de Ética - Backend

Sistema simples de backend para envio de e-mails do Canal de Ética usando Node.js e Express.

## Como instalar e rodar

### 1. Instalar as dependências:

```bash
npm install
```

### 2. Configurar as credenciais:

Edite o arquivo `.env` com suas credenciais. Você pode usar **Gmail** ou um **servidor SMTP próprio**.

#### Opção A: Usando Gmail

- `GMAIL_USER`: Seu e-mail Gmail
- `GMAIL_APP_PASSWORD`: Sua senha de aplicativo (sem espaços)
- `TO_EMAIL`: E-mail que receberá as denúncias (separados por vírgula)
- `PORT`: Porta do servidor (padrão: 3000)

**Importante:** Use uma senha de aplicativo, não sua senha normal do Gmail!
Para criar uma senha de aplicativo:

1. Ative a verificação em duas etapas na sua conta Google
2. Acesse: https://myaccount.google.com/apppasswords
3. Gere uma senha de aplicativo

#### Opção B: Usando Servidor SMTP Próprio (Para VPS)

- `SMTP_HOST`: Host do servidor SMTP (ex: `localhost` ou `mail.seu-dominio.com.br`)
- `SMTP_PORT`: Porta SMTP (padrão: `587`)
- `SMTP_SECURE`: `true` para porta 465 (SSL), `false` para outras portas
- `SMTP_USER`: Usuário SMTP (opcional, se autenticação for necessária)
- `SMTP_PASS`: Senha SMTP (opcional, se autenticação for necessária)
- `SMTP_TLS_REJECT_UNAUTHORIZED`: `false` para aceitar certificados auto-assinados
- `FROM_EMAIL`: Endereço de e-mail do remetente (ex: `canal-etica@seu-dominio.com.br`)
- `TO_EMAIL`: E-mails que receberão as denúncias (separados por vírgula)
- `PORT`: Porta do servidor (padrão: 3000)

**Nota:** Se `SMTP_HOST` estiver configurado, o sistema usará o servidor SMTP próprio. Caso contrário, usará Gmail.

📖 **Para configuração completa de servidor SMTP próprio na VPS, consulte:** `SETUP_SMTP.md`

### 3. Iniciar o servidor:

```bash
npm start
```

O servidor estará rodando em: `http://localhost:3000`

### 4. Abrir o formulário:

Abra o arquivo `index.html` no navegador ou acesse: `http://localhost:3000`

## Estrutura

- `server.js`: Servidor Express que processa os envios
- `index.html`: Formulário web
- `.env`: Configurações (credenciais)
- `package.json`: Dependências do projeto

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

### GET `/api/health`

Verifica se o servidor está funcionando.
