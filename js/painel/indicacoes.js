/* ---------- INDICAÇÕES ---------- */
function dashIndicacoes(){
  const u=me();
  const indicados=S.users.filter(usuario=>usuario.referredBy===u.refCode);
  const concluidos=indicados.filter(usuario=>S.orders.some(pedido=>pedido.status==='concluido'&&
    (pedido.clientId===usuario.id||(usuario.proId&&pedido.proId===usuario.proId))));
  const creditosRegistrados=concluidos.length?S.tx.filter(tx=>tx.ownerId===u.id&&tx.type==='in'&&/(indic|referr)/i.test(
    (tx.label||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  )).reduce((total,tx)=>total+(Number(tx.amount)||0),0):0;
  const ganhos=Math.min(concluidos.length*50,creditosRegistrados);
  return dashHead('Indique e ganhe','Ganhe R$ 50 por cada amigo que concluir o primeiro serviço.')+
  '<div class="card" style="background:linear-gradient(135deg,color-mix(in srgb,var(--purple) 20%,var(--surface)),color-mix(in srgb,var(--brand) 16%,var(--surface)));text-align:center;padding:38px">'+
  '<div class="ico-box" style="margin:0 auto 16px">'+ic('gift')+'</div>'+
  '<h3>Seu código de indicação</h3>'+
  '<div style="font-size:2rem;font-weight:800;letter-spacing:.16em;margin:16px 0;color:var(--brand)">'+esc(u.refCode)+'</div>'+
  '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">'+
  '<button class="btn btn-grad" onclick="copiar(\''+esc(u.refCode)+'\')">'+ic('copy')+' Copiar código</button>'+
  '<button class="btn btn-ghost" onclick="copiar(\'https://taskgo.com.br/r/'+esc(u.refCode)+'\')">'+ic('nav')+' Copiar link</button></div></div>'+
  '<div class="grid g3" style="margin-top:22px">'+
  [['Amigos indicados',String(indicados.length)],['Concluíram 1º serviço',String(concluidos.length)],['Total ganho',money(ganhos)]]
  .map(s=>'<div class="stat"><div class="lbl">'+s[0]+'</div><div class="val">'+s[1]+'</div></div>').join('')+'</div>'+
  '<div class="card" style="margin-top:22px"><h3 style="font-size:1.05rem;margin-bottom:16px">Como funciona</h3>'+
  '<div class="grid g3">'+[['Compartilhe','Envie seu código ou link para amigos.'],['Ele contrata','Seu amigo ganha R$ 20 de desconto no 1º serviço.'],['Você ganha','R$ 50 em créditos assim que o serviço for concluído.']]
  .map((x,i)=>'<div><div class="ico-box" style="margin-bottom:12px">'+ic(['nav','user','gift'][i])+'</div><b style="display:block;margin-bottom:4px">'+x[0]+'</b>'+
  '<span class="muted" style="font-size:.88rem">'+x[1]+'</span></div>').join('')+'</div></div>';
}

