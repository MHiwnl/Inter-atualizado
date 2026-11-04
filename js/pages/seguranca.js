/* ---------- SEGURANÇA ---------- */
function pageSeguranca(){
  return '<section class="section"><div class="wrap">'+
  '<div class="sec-head"><span class="eyebrow">'+ic('shield')+' Confiança & Segurança</span><h2>Como protegemos você</h2>'+
  '<p>Segurança não é um recurso extra na TaskGO — é a base do produto.</p></div>'+
  '<div class="grid g2">'+[
    ['user','Verificação de identidade','Todo profissional envia documento oficial com foto, selfie biométrica e CPF validado na Receita Federal antes de ser aprovado.'],
    ['key','Código de chegada','Código único de 4 dígitos por pedido. Sem a validação, o serviço não é iniciado no aplicativo.'],
    ['nav','Rota monitorada','O deslocamento fica registrado. Você pode compartilhar o acompanhamento com um contato de confiança em um toque.'],
    ['flag','Botão de emergência','Durante o atendimento, um toque aciona nosso time de segurança e, se necessário, as autoridades locais.'],
    ['lock','Pagamento retido','O valor só é liberado ao profissional depois que você confirma a conclusão do serviço.'],
    ['shield','Garantia de 90 dias','Problemas no serviço executado são reexecutados ou reembolsados conforme nossa política de garantia.']
  ].map(x=>'<div class="card" style="display:flex;gap:16px"><div class="ico-box" style="flex:none">'+ic(x[0])+'</div>'+
    '<div><b style="display:block;margin-bottom:6px">'+x[1]+'</b><span class="muted" style="font-size:.9rem">'+x[2]+'</span></div></div>').join('')+'</div>'+
  '<div class="card" style="margin-top:36px;border-color:color-mix(in srgb,var(--danger) 40%,var(--line))">'+
  '<div style="display:flex;gap:14px;align-items:center"><div class="ico-box" style="background:color-mix(in srgb,var(--danger) 14%,transparent);border-color:color-mix(in srgb,var(--danger) 30%,transparent)">'+ic('flag')+'</div>'+
  '<div style="flex:1;min-width:220px"><b>Precisa de ajuda urgente?</b><p class="muted" style="font-size:.9rem">Nosso time de emergência responde 24 horas por dia, todos os dias.</p></div>'+
  '<a class="btn btn-danger" href="#/contato">Acionar suporte</a></div></div>'+
  '</div></section>';
}

