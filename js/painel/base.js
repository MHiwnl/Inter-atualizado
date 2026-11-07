/* =========================================================
   PAINEL
   ========================================================= */
const ST={
  aguardando:['Aguardando aceite','tag-warn'],
  a_caminho:['A caminho','tag-info'],
  chegou:['Chegou ao local','tag-info'],
  em_andamento:['Em andamento','tag-info'],
  concluido:['Concluído','tag-ok'],
  agendado:['Agendado','tag-muted'],
  cancelado:['Cancelado','tag-danger']
};
function stTag(s){const x=ST[s]||['—','tag-muted'];return '<span class="tag '+x[1]+'">'+x[0]+'</span>';}
function dashHead(t,s,actions){
  return '<div class="dash-head"><div><h1>'+t+'</h1><p>'+s+'</p></div><div style="display:flex;gap:10px;flex-wrap:wrap">'+(actions||'')+'</div></div>';
}
function myOrders(){
  const u=me();if(!u)return[];
  const email=String(u.email||'').toLowerCase();
  return S.orders.filter(o=>u.role==='profissional'?
    (o.proEmail&&String(o.proEmail).toLowerCase()===email)||o.proId===u.proId:
    (o.clientEmail&&String(o.clientEmail).toLowerCase()===email)||o.clientId===u.id);
}

