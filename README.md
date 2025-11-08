# Canal de Ética - Sakura

Interface web do Canal de Ética da Sakura. O projeto é totalmente estático (HTML + Tailwind via CDN) e integra-se a um backend externo para envio de denúncias por e-mail.

## Visão Geral

- Formulário responsivo com Tailwind CSS.
- Opção de denúncia anônima ou identificada, com campos condicionais.
- Campo dedicado para listar os destinatários (separe por vírgulas).
- Mensagens de feedback e loading em português.
- Modal com Código de Conduta carregado dinamicamente de `conduta.html`.
- Integração com endpoint configurável via `fetch`.

## Pré-requisitos

Nenhuma etapa de build é necessária. Para visualizar:

1. Abra `index.html` diretamente no navegador, ou
2. Sirva a pasta com um servidor estático simples (ex.: `npx serve .`, `python -m http.server`, etc.).

> ⚠️ O formulário usa `fetch` para `http://servidor:3333/api/send-ethics-report`. Atualize o valor da constante `API_URL` em `index.html` caso seu backend esteja em outra URL.

## Configuração Rápida

- **Endpoint:** edite `API_URL` em `index.html`.
- **Destinatários:** informe os e-mails no campo “E-mails que receberão a denúncia” ao enviar o formulário.
- **Logo:** substitua `logo.png` pelo logotipo desejado (há fallback automático caso não exista).
- **Código de Conduta:** atualize `conduta.html`; o modal carrega esse arquivo via `fetch`.

## Estrutura do Projeto

- `index.html` — página principal com formulário, scripts e modal.
- `conduta.html` — conteúdo rico do Código de Conduta.
- `conduta.txt` — texto de referência utilizado para montar a versão HTML.
- `logo.png` — imagem exibida na área superior do formulário.

## Como Utilizar

1. Abra o formulário.
2. Selecione o tipo de relato e preencha a descrição (obrigatório).
3. Decida se deseja se identificar e preencha nome/contato, se necessário.
4. Informe um ou mais e-mails de destino no campo específico.
5. Clique em **Enviar Denúncia** e aguarde a mensagem de sucesso.
6. Use o botão **Ver Código de Conduta** para consultar o documento dinâmico.

## Personalizações Sugeridas

- Ajuste textos, cores ou estilos diretamente em `index.html`.
- Inclua validações adicionais conforme regras internas.
- Publique os arquivos em um ambiente HTTPS e garanta que o backend aceite CORS do domínio onde o formulário será hospedado.

## Suporte

Em caso de dúvidas, contate a equipe responsável pelo Canal de Ética da Sakura.
