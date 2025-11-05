// Função para escapar HTML (prevenir XSS)
function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Função para gerar o template HTML do e-mail
function generateEmailHtml(data) {
  const { tipo_relato, identificacao, nome, contato, pessoas_envolvidas, descricao, logoBase64 } = data;

  // Escapa todos os dados de entrada
  const tipoRelatoEscaped = escapeHtml(tipo_relato);
  const descricaoEscaped = escapeHtml(descricao).replace(/\n/g, "<br>");
  const pessoasEnvolvidasEscaped = escapeHtml(pessoas_envolvidas || "Não informado");
  const dataHora = new Date().toLocaleString("pt-BR");

  // Gera HTML da seção de identificação
  let identificacaoHtml = "";
  if (identificacao === "on") {
    const nomeEscaped = escapeHtml(nome || "Não informado");
    const contatoEscaped = escapeHtml(contato || "Não informado");
    identificacaoHtml = `
        <tr>
          <td style="padding: 8px 0; color: #e0e0e0;">
            <strong style="color: #ffffff;">Nome:</strong> ${nomeEscaped}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #e0e0e0;">
            <strong style="color: #ffffff;">Contato:</strong> ${contatoEscaped}
          </td>
        </tr>
      `;
  } else {
    identificacaoHtml = `
        <tr>
          <td style="padding: 8px 0; color: #e0e0e0;">
            <strong style="color: #ffffff;">Identificação:</strong> Anônimo
          </td>
        </tr>
      `;
  }

  // Template HTML completo
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova Denúncia - Canal de Ética</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #2d2d2d; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
              ${
                logoBase64
                  ? `
              <div style="margin-bottom: 20px;">
                <img src="data:image/png;base64,${logoBase64}" alt="Logo Sakura" style="max-width: 200px; height: auto; display: block; margin: 0 auto;">
              </div>
              `
                  : ""
              }
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                🔔 Nova Denúncia Recebida
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                Canal de Ética - Sakura
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px 20px; background-color: #2d2d2d;">
              
              <!-- Tipo de Relato -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px 16px; background-color: #3d3d3d; border-left: 4px solid #667eea; border-radius: 4px; margin-bottom: 20px;">
                    <strong style="color: #667eea; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Tipo de Relato
                    </strong>
                    <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                      ${tipoRelatoEscaped}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Identificação -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                <tr>
                  <td style="padding-bottom: 8px;">
                    <h2 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600; border-bottom: 2px solid #4d4d4d; padding-bottom: 8px;">
                      Identificação
                    </h2>
                  </td>
                </tr>
                ${identificacaoHtml}
              </table>

              <!-- Pessoas Envolvidas -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                <tr>
                  <td style="padding-bottom: 8px;">
                    <h2 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600; border-bottom: 2px solid #4d4d4d; padding-bottom: 8px;">
                      Pessoas Envolvidas
                    </h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #e0e0e0; font-size: 15px;">
                    ${pessoasEnvolvidasEscaped}
                  </td>
                </tr>
              </table>

              <!-- Descrição -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                <tr>
                  <td style="padding-bottom: 8px;">
                    <h2 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600; border-bottom: 2px solid #4d4d4d; padding-bottom: 8px;">
                      Descrição do Fato
                    </h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px; background-color: #3d3d3d; border-radius: 6px; margin-top: 12px;">
                    <div style="color: #e0e0e0; font-size: 15px; line-height: 1.6;">
                      ${descricaoEscaped}
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #3d3d3d; padding: 20px; text-align: center; border-top: 1px solid #4d4d4d;">
              <p style="margin: 0; color: #b0b0b0; font-size: 13px;">
                <strong style="color: #ffffff;">Data/Hora do Recebimento:</strong><br>
                ${dataHora}
              </p>
              <p style="margin: 15px 0 0 0; color: #888888; font-size: 12px;">
                Este é um e-mail automático do sistema Canal de Ética - Sakura
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Função para gerar o corpo do e-mail em texto plano
function generateEmailText(data) {
  const { tipo_relato, identificacao, nome, contato, pessoas_envolvidas, descricao } = data;

  let emailBodyText = "NOVA DENÚNCIA - CANAL DE ÉTICA\n\n";
  emailBodyText += "========================================\n\n";
  emailBodyText += `Tipo de Relato: ${tipo_relato}\n\n`;

  if (identificacao === "on") {
    emailBodyText += "IDENTIFICAÇÃO:\n";
    emailBodyText += `Nome: ${nome || "Não informado"}\n`;
    emailBodyText += `Contato: ${contato || "Não informado"}\n\n`;
  } else {
    emailBodyText += "IDENTIFICAÇÃO: Anônimo\n\n";
  }

  emailBodyText += `Pessoas Envolvidas: ${pessoas_envolvidas || "Não informado"}\n\n`;
  emailBodyText += `DESCRIÇÃO DO FATO:\n${descricao}\n\n`;
  emailBodyText += "========================================\n";
  emailBodyText += `Data/Hora: ${new Date().toLocaleString("pt-BR")}\n`;

  return emailBodyText;
}

module.exports = {
  generateEmailHtml,
  generateEmailText,
  escapeHtml
};
