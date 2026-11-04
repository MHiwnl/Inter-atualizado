/* ---------- PEDIDOS ---------- */
let filtroPedidos='todos';
function dashPedidos(){
  const os=myOrders().filter(o=>filtroPedidos==='todos'?true:filtroPedidos==='ativos'?['a_caminho','chegou','em_andamento','agendado','aguardando'].includes(o.status):o.status===filtroPedidos);
  const isPro=me().role==='profissional';
  return dashHead(isPro?'Meus atendimentos':'Meus pedidos',isPro?'Todos os serviços que você executou ou vai executar.':'Histórico completo e acompanhamento em tempo real.',
    isPro?'<a class="btn btn-grad" href="#/painel/oportunidades">'+ic('target')+' Ver oportunidades</a>':'<a class="btn btn-grad" href="#/contratar">'+ic('plus')+' Novo pedido</a>')+
  '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px">'+
  [['todos','Todos'],['ativos','Ativos'],['concluido','Concluídos'],['cancelado','Cancelados']]
  .map(f=>'<button class="pill '+(filtroPedidos===f[0]?'pill-brand':'')+'" onclick="filtroPedidos=\''+f[0]+'\';render()">'+f[1]+'</button>').join('')+'</div>'+
  (os.length?os.map(o=>orderRow(o)).join('')
   :'<div class="card emptystate">'+ic('list')+'<b>Nenhum pedido aqui</b><p style="margin-top:6px">'+(isPro?'Aceite uma oportunidade para começar a atender.':'Que tal contratar seu primeiro serviço?')+'</p><a class="btn btn-primary" style="margin-top:16px" href="'+(isPro?'#/painel/oportunidades':'#/contratar')+'">'+(isPro?'Ver oportunidades':'Contratar agora')+'</a></div>');
}

