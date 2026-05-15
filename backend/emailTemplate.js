function formatBRL(valor) {
  return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}

function escapeHtml(texto = '') {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function gerarHtmlEmailPedido({
  nomeCliente,
  numeroPedido,
  itens,
  total,
  imagemLoja,
}) {
  const itensHtml = itens
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;">
            <div style="font-weight:700;color:#1C1410;">${escapeHtml(item.nome)}</div>
            <div style="font-size:13px;color:#8C8070;">
              Quantidade: ${Number(item.qtd)} • Valor unitário: ${formatBRL(item.preco)}
            </div>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;font-weight:700;color:#7D1D3F;">
            ${formatBRL(item.preco * item.qtd)}
          </td>
        </tr>
      `
    )
    .join('');

  const blocoImagem = imagemLoja
    ? `<img src="${escapeHtml(imagemLoja)}" alt="SnapBite" style="max-width:160px;height:auto;display:block;margin:0 auto 16px;">`
    : '';

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pedido concluído - SnapBite</title>
      </head>
      <body style="margin:0;padding:0;background:#FDFAF4;font-family:Arial,Helvetica,sans-serif;color:#1C1410;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFAF4;padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:700px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #EAE0CC;">
                <tr>
                  <td style="background:#2D2420;padding:28px 32px;text-align:center;">
                    ${blocoImagem}
                    <div style="font-size:28px;font-weight:800;color:#C8952A;">SnapBite</div>
                    <div style="font-size:14px;color:#d4c4a8;margin-top:6px;">
                      Pedido concluído com sucesso
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0 0 12px;font-size:16px;">
                      Olá, <strong>${escapeHtml(nomeCliente)}</strong>!
                    </p>

                    <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#4A3E38;">
                      Seu pedido foi concluído com sucesso. Obrigado por comprar com a SnapBite!
                    </p>

                    <div style="background:#F5EFE0;border:1px solid #EAE0CC;border-radius:14px;padding:18px 20px;margin-bottom:24px;">
                      <div style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8C8070;margin-bottom:8px;">
                        Número do pedido
                      </div>
                      <div style="font-size:28px;font-weight:900;color:#7D1D3F;letter-spacing:2px;">
                        ${escapeHtml(numeroPedido)}
                      </div>
                    </div>

                    <h2 style="margin:0 0 14px;font-size:20px;color:#1C1410;">Resumo do pedido</h2>

                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px;">
                      ${itensHtml}
                    </table>

                    <div style="text-align:right;margin:8px 0 24px;">
                      <span style="font-size:14px;color:#8C8070;">Total</span><br>
                      <span style="font-size:28px;font-weight:900;color:#7D1D3F;">
                        ${formatBRL(total)}
                      </span>
                    </div>

                    <div style="background:#fff8ec;border:1px solid #F2D97A;border-radius:12px;padding:16px 18px;margin-bottom:20px;">
                      <p style="margin:0;font-size:14px;line-height:1.7;color:#4A3E38;">
                        Seu pedido ficará disponível para retirada no balcão da loja no horário informado.
                      </p>
                    </div>

                    <p style="margin:0;font-size:13px;line-height:1.7;color:#8C8070;">
                      Se tiver qualquer dúvida, fale com a equipe da SnapBite.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="background:#2D2420;padding:18px 24px;text-align:center;">
                    <div style="font-size:12px;color:#A09080;">
                      © SnapBite • Feito por estudantes do SENAI
                    </div>
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


export function gerarHtmlEmailRecuperacaoSenha({ nomeCliente = 'estudante', resetLink }) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Redefinição de senha - SnapBite</title>
      </head>
      <body style="margin:0;padding:0;background:#EEF2FF;font-family:Arial,Helvetica,sans-serif;color:#0A0F1E;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2FF;padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid #D6DCF5;box-shadow:0 18px 50px rgba(0,51,153,.12);">
                <tr>
                  <td style="background:linear-gradient(135deg,#003399,#E30613);padding:30px 26px;text-align:center;">
                    <div style="font-size:30px;font-weight:900;color:#fff;">SnapBite 🔒</div>
                    <div style="font-size:14px;color:#fff;margin-top:8px;opacity:.9;">Recuperação de senha</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:34px 30px;">
                    <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#5C6680;">
                      Olá, <strong style="color:#0A0F1E;">${escapeHtml(nomeCliente)}</strong>!
                    </p>
                    <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:#5C6680;">
                      Recebemos uma solicitação para redefinir a senha da sua conta SnapBite. Clique no botão abaixo para criar uma nova senha.
                    </p>
                    <div style="background:#F7F9FF;border:2px dashed #003399;border-radius:18px;padding:28px 24px;text-align:center;margin-bottom:22px;">
                      <div style="font-size:13px;font-weight:800;color:#5C6680;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">Seu link de redefinição</div>
                      <table cellpadding="0" cellspacing="0" align="center">
                        <tr>
                          <td align="center" style="border-radius:14px;background:linear-gradient(135deg,#003399,#E30613);">
                            <a href="${escapeHtml(resetLink)}" style="display:inline-block;padding:15px 32px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:800;border-radius:14px;letter-spacing:.3px;">
                              🔒 REDEFINIR SENHA
                            </a>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div style="background:#FFF5F5;border-left:5px solid #E30613;padding:16px 18px;border-radius:12px;">
                      <p style="margin:0;font-size:14px;line-height:1.7;color:#7F1D1D;">
                        Se não foi você, ignore essa mensagem! Nunca compartilhe esse link com outras pessoas.
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background:#001A66;padding:18px 22px;text-align:center;">
                    <div style="font-size:12px;color:#D6DCF5;">© SnapBite • Segurança da conta</div>
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


export function gerarHtmlCodigoPerfil({ nomeCliente = 'estudante', codigo }) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Código de segurança - SnapBite</title>
      </head>
      <body style="margin:0;padding:0;background:#EEF2FF;font-family:Arial,Helvetica,sans-serif;color:#0A0F1E;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2FF;padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid #D6DCF5;box-shadow:0 18px 50px rgba(0,51,153,.12);">
                <tr>
                  <td style="background:linear-gradient(135deg,#003399,#E30613);padding:30px 26px;text-align:center;">
                    <div style="font-size:30px;font-weight:900;color:#fff;">SnapBite 🔐</div>
                    <div style="font-size:14px;color:#fff;margin-top:8px;opacity:.9;">Código de segurança do perfil</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:34px 30px;">
                    <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#5C6680;">
                      Olá, <strong style="color:#0A0F1E;">${escapeHtml(nomeCliente)}</strong>!
                    </p>
                    <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:#5C6680;">
                      Use o código abaixo para confirmar alterações no seu perfil SnapBite.
                    </p>
                    <div style="background:#F7F9FF;border:2px dashed #003399;border-radius:18px;padding:24px;text-align:center;margin-bottom:22px;">
                      <div style="font-size:13px;font-weight:800;color:#5C6680;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Seu código</div>
                      <div style="font-size:42px;font-weight:900;letter-spacing:8px;color:#E30613;">${escapeHtml(codigo)}</div>
                    </div>
                    <div style="background:#FFF5F5;border-left:5px solid #E30613;padding:16px 18px;border-radius:12px;">
                      <p style="margin:0;font-size:14px;line-height:1.7;color:#7F1D1D;">
                        Se não foi você, ignore essa mensagem! Nunca compartilhe esse código com outras pessoas.
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background:#001A66;padding:18px 22px;text-align:center;">
                    <div style="font-size:12px;color:#D6DCF5;">© SnapBite • Segurança da conta</div>
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