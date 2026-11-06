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
const MENU_CLI=[
  ['g','Principal'],['','Visão geral','grid'],['pedidos','Meus pedidos','list'],['carteira','Carteira','wallet'],
  ['g','Atividade'],['mensagens','Mensagens','chat'],['avaliacoes','Avaliações','star'],['notificacoes','Notificações','bell'],
  ['g','Conta'],['indicacoes','Indique e ganhe','gift'],['plano','Meu plano','crown'],['config','Configurações','cog']
];
const MENU_PRO=[
  ['g','Principal'],['','Visão geral','grid'],['oportunidades','Oportunidades','target'],['pedidos','Meus atendimentos','list'],['agenda','Agenda','cal'],
  ['g','Financeiro'],['carteira','Carteira & Ganhos','wallet'],['desempenho','Desempenho','trendUp'],
  ['g','Atividade'],['mensagens','Mensagens','chat'],['avaliacoes','Avaliações','star'],['notificacoes','Notificações','bell'],
  ['g','Conta'],['indicacoes','Indique e ganhe','gift'],['plano','Meu plano','crown'],['config','Configurações','cog']
];
function pageDash(){
  const u=me();
  if(!u){go('/entrar');return '';}
  const isPro=u.role==='profissional';
  const menu=isPro?MENU_PRO:MENU_CLI;
  const unread=myNotifs().filter(n=>!n.read).length;
  const side='<aside class="side">'+
    '<div class="side-user">'+avatar(u,42)+'<div style="min-width:0"><b>'+esc(u.name)+'</b><span>'+(isPro?'Profissional':'Cliente')+(u.plan==='plus'?' · Plus':'')+'</span></div></div>'+
    menu.map(m=>m[0]==='g'?'<div class="side-group">'+m[1]+'</div>':
      '<a href="#/painel'+(m[0]?'/'+m[0]:'')+'" class="'+(route.sub===m[0]?'active':'')+'">'+ic(m[2])+'<span>'+m[1]+'</span>'+(m[0]==='notificacoes'&&unread?'<span class="badge">'+unread+'</span>':'')+'</a>').join('')+
    '<div class="side-group">Sair</div><a href="javascript:void(0)" onclick="logout()">'+ic('logout')+'<span>Encerrar sessão</span></a>'+
  '</aside>';
  let content='';
  const sub=route.sub;
  if(sub==='pedido')content=dashPedido(route.id);
  else if(sub==='pedidos')content=dashPedidos();
  else if(sub==='carteira')content=dashCarteira();
  else if(sub==='mensagens')content=dashMensagens();
  else if(sub==='avaliacoes')content=dashAvaliacoes();
  else if(sub==='notificacoes')content=dashNotificacoes();
  else if(sub==='indicacoes')content=dashIndicacoes();
  else if(sub==='config')content=dashConfig();
  else if(sub==='plano')content=dashPlano();
  else if(sub==='agenda')content=dashAgenda();
  else if(sub==='desempenho')content=dashDesempenho();
  else if(sub==='oportunidades')content=dashOportunidades();
  else content=dashVisao();
  return '<div class="dash">'+side+'<main class="dash-main">'+dashTools()+content+'</main></div>';
}
function dashHead(t,s,actions){
  return '<div class="dash-head"><div><h2>'+t+'</h2><p>'+s+'</p></div><div style="display:flex;gap:10px;flex-wrap:wrap">'+(actions||'')+'</div></div>';
}
function myOrders(){
  const u=me();if(!u)return[];
  const email=String(u.email||'').toLowerCase();
  return S.orders.filter(o=>u.role==='profissional'?
    (o.proEmail&&String(o.proEmail).toLowerCase()===email)||o.proId===u.proId:
    (o.clientEmail&&String(o.clientEmail).toLowerCase()===email)||o.clientId===u.id);
}

