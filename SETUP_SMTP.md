# Guia: Configurando Servidor de E-mails Próprio na VPS

Este guia explica como configurar um servidor SMTP próprio na sua VPS para substituir o Gmail.

## 📋 O que você precisa fazer

### 1. **Instalar e Configurar Postfix (Servidor SMTP)**

Postfix é o servidor de e-mail mais comum para Linux.

#### Instalação (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install postfix mailutils
```

Durante a instalação, selecione:

- **Tipo de configuração**: "Site da Internet"
- **Nome do sistema**: seu domínio (ex: `sakura.com.br`)

#### Configuração básica do Postfix:

Edite o arquivo de configuração:

```bash
sudo nano /etc/postfix/main.cf
```

Adicione/modifique estas linhas:

```
myhostname = seu-dominio.com.br
mydomain = seu-dominio.com.br
myorigin = $mydomain
inet_interfaces = loopback-only
inet_protocols = ipv4
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
relayhost =
```

#### Reiniciar o Postfix:

```bash
sudo systemctl restart postfix
sudo systemctl enable postfix
```

### 2. **Configurar DNS (CRÍTICO para evitar spam)**

Você precisa configurar os seguintes registros DNS no seu provedor de domínio:

#### A. Registro MX (Mail Exchange)

```
Tipo: MX
Nome: @ (ou seu-dominio.com.br)
Valor: mail.seu-dominio.com.br (ou IP da sua VPS)
Prioridade: 10
TTL: 3600
```

#### B. Registro SPF (Sender Policy Framework)

```
Tipo: TXT
Nome: @
Valor: v=spf1 mx a ip4:SEU_IP_VPS ~all
TTL: 3600
```

#### C. Registro DKIM (DomainKeys Identified Mail)

1. Instale o OpenDKIM:

```bash
sudo apt install opendkim opendkim-tools
```

2. Gere a chave:

```bash
sudo mkdir -p /etc/opendkim/keys
sudo opendkim-genkey -b 2048 -d seu-dominio.com.br -D /etc/opendkim/keys -s default -v
sudo chown opendkim:opendkim /etc/opendkim/keys/default.private
```

3. Configure o OpenDKIM:

```bash
sudo nano /etc/opendkim.conf
```

Adicione:

```
Domain seu-dominio.com.br
KeyFile /etc/opendkim/keys/default.private
Selector default
```

4. Obtenha a chave pública:

```bash
sudo cat /etc/opendkim/keys/default.txt
```

5. Adicione o registro TXT no DNS:

```
Tipo: TXT
Nome: default._domainkey
Valor: (o conteúdo do arquivo default.txt, removendo quebras de linha)
```

#### D. Registro DMARC (Domain-based Message Authentication)

```
Tipo: TXT
Nome: _dmarc
Valor: v=DMARC1; p=quarantine; rua=mailto:admin@seu-dominio.com.br
TTL: 3600
```

### 3. **Configurar Firewall**

Libere as portas necessárias:

```bash
# SMTP (porta 25)
sudo ufw allow 25/tcp

# SMTP submission (porta 587)
sudo ufw allow 587/tcp

# SMTP SSL (porta 465)
sudo ufw allow 465/tcp
```

### 4. **Configurar o .env**

Atualize seu arquivo `.env` com as configurações do servidor SMTP:

```env
# Configuração SMTP próprio (use se tiver servidor SMTP próprio)
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_TLS_REJECT_UNAUTHORIZED=false
FROM_EMAIL=canal-etica@seu-dominio.com.br

# OU use Gmail (se não configurar SMTP_HOST)
# GMAIL_USER=seu-email@gmail.com
# GMAIL_APP_PASSWORD=sua-senha-app

# Destinatários (separados por vírgula)
TO_EMAIL=admin@seu-dominio.com.br,outro@email.com

# Porta do servidor Node.js
PORT=3000
```

### 5. **Testar o Servidor SMTP**

Teste se o Postfix está funcionando:

```bash
echo "Teste de e-mail" | mail -s "Teste" seu-email@exemplo.com
```

Ou usando o Node.js:

```bash
node -e "const nodemailer = require('nodemailer'); const transporter = nodemailer.createTransport({ host: 'localhost', port: 587, secure: false }); transporter.sendMail({ from: 'teste@seu-dominio.com.br', to: 'seu-email@exemplo.com', subject: 'Teste', text: 'Teste de envio' }).then(console.log).catch(console.error);"
```

### 6. **Gerenciar o Processo Node.js na VPS**

#### Opção A: Usando PM2 (Recomendado)

1. Instale o PM2:

```bash
npm install -g pm2
```

2. Inicie o servidor:

```bash
pm2 start server.js --name canal-etica
```

3. Configure para iniciar automaticamente:

```bash
pm2 startup
pm2 save
```

4. Comandos úteis:

```bash
pm2 status          # Ver status
pm2 logs            # Ver logs
pm2 restart canal-etica  # Reiniciar
pm2 stop canal-etica     # Parar
```

#### Opção B: Usando systemd

Crie um arquivo de serviço:

```bash
sudo nano /etc/systemd/system/canal-etica.service
```

Conteúdo:

```ini
[Unit]
Description=Canal de Ética - Servidor Node.js
After=network.target

[Service]
Type=simple
User=seu-usuario
WorkingDirectory=/caminho/para/seu/projeto
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Ative o serviço:

```bash
sudo systemctl daemon-reload
sudo systemctl enable canal-etica
sudo systemctl start canal-etica
sudo systemctl status canal-etica
```

### 7. **Configurar Nginx (Opcional - para HTTPS)**

Se quiser usar HTTPS, configure um reverse proxy com Nginx:

```bash
sudo apt install nginx certbot python3-certbot-nginx
```

Configure o Nginx:

```nginx
server {
    listen 80;
    server_name seu-dominio.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Obtenha certificado SSL:

```bash
sudo certbot --nginx -d seu-dominio.com.br
```

## ⚠️ Importante

1. **Reputação IP**: Novos servidores de e-mail podem ter problemas de reputação. E-mails podem ir para spam inicialmente.

2. **Blacklists**: Verifique se seu IP não está em blacklists:

   - https://mxtoolbox.com/blacklists.aspx

3. **Rate Limiting**: Configure limites de envio para evitar abuso:

   - No Postfix, configure `smtpd_recipient_limit` e `smtpd_recipient_restrictions`

4. **Backup**: Configure backups regulares das configurações do Postfix.

5. **Monitoramento**: Monitore os logs:
   ```bash
   sudo tail -f /var/log/mail.log
   ```

## 🔍 Verificar se está funcionando

1. Verifique os logs do servidor Node.js:

```bash
pm2 logs canal-etica
```

2. Verifique os logs do Postfix:

```bash
sudo tail -f /var/log/mail.log
```

3. Teste o envio de e-mail através da API:

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"tipo_relato":"Teste","descricao":"Teste de envio"}'
```

## 📚 Recursos Adicionais

- [Documentação do Postfix](http://www.postfix.org/documentation.html)
- [Guia de configuração DNS para e-mail](https://www.mail-tester.com/spf-dkim-check)
- [Verificador de configuração DNS](https://mxtoolbox.com/SuperTool.aspx)

## 🆘 Troubleshooting

### E-mails não são entregues:

- Verifique os logs: `sudo tail -f /var/log/mail.log`
- Verifique se o DNS está configurado corretamente
- Teste a conectividade: `telnet seu-dominio.com.br 25`

### E-mails vão para spam:

- Verifique se SPF, DKIM e DMARC estão configurados
- Use ferramentas como [mail-tester.com](https://www.mail-tester.com) para verificar a configuração

### Erro de conexão no Node.js:

- Verifique se o Postfix está rodando: `sudo systemctl status postfix`
- Verifique se a porta está aberta: `sudo netstat -tlnp | grep :587`
- Verifique as credenciais no `.env`
