const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { generateEmailHtml, generateEmailText } = require("./emailTemplate");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(".")); // Serve arquivos estáticos (index.html)

// Configuração do Nodemailer com Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Rota para enviar e-mail
app.post("/api/send-email", async (req, res) => {
  try {
    const { tipo_relato, identificacao, nome, contato, pessoas_envolvidas, descricao } = req.body;

    // Validação básica
    if (!tipo_relato || !descricao) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios não preenchidos"
      });
    }

    // Lê a logo e converte para base64 (para usar no e-mail)
    let logoBase64 = null;
    try {
      const logoPath = path.join(__dirname, "logo.png");
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        logoBase64 = logoBuffer.toString("base64");
      }
    } catch (error) {
      console.warn("Logo não encontrada, e-mail será enviado sem logo:", error.message);
    }

    // Gera o corpo do e-mail em HTML e texto
    const emailData = {
      tipo_relato,
      identificacao,
      nome,
      contato,
      pessoas_envolvidas,
      descricao,
      logoBase64 // Passa a logo em base64 para o template
    };

    const emailBodyHtml = generateEmailHtml(emailData);
    const emailBodyText = generateEmailText(emailData);

    // Configuração do e-mail - Envia separadamente para cada destinatário
    // No .env, separe os e-mails por vírgula: TO_EMAIL=email1@exemplo.com,email2@exemplo.com,email3@exemplo.com
    const toEmails = process.env.TO_EMAIL.split(",")
      .map((email) => email.trim())
      .filter((email) => email); // Remove e-mails vazios

    // Envia um e-mail separado para cada destinatário
    const sendPromises = toEmails.map(async (email) => {
      const mailOptions = {
        from: `"Canal de Ética - Sakura" <${process.env.GMAIL_USER}>`,
        to: email, // Envia para um e-mail por vez
        subject: "Nova Denúncia - Canal de Ética",
        text: emailBodyText, // Versão texto para clientes que não suportam HTML
        html: emailBodyHtml // Versão HTML formatada
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`E-mail enviado com sucesso para ${email}:`, info.messageId);
      return { email, success: true, messageId: info.messageId };
    });

    // Aguarda todos os e-mails serem enviados
    const results = await Promise.allSettled(sendPromises);

    // Verifica se algum e-mail falhou
    const failures = results.filter((result) => result.status === "rejected");
    if (failures.length > 0) {
      console.error("Alguns e-mails falharam:", failures);
      // Continua mesmo assim, mas registra o erro
    }

    const successCount = results.filter((result) => result.status === "fulfilled").length;
    console.log(`Total de e-mails enviados: ${successCount}/${toEmails.length}`);

    res.json({
      success: true,
      message: "Denúncia enviada com sucesso!"
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao enviar a denúncia. Tente novamente mais tarde.",
      error: error.message
    });
  }
});

// Rota para verificar se o servidor está rodando
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Servidor funcionando!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Acesse http://localhost:${PORT} no navegador`);
});
