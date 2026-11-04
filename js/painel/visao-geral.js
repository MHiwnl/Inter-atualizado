/* ---------- VISÃO GERAL ---------- */
function dashVisao(){
  const u=me(),isPro=u.role==='profissional',os=myOrders();
  const ativo=os.find(o=>['a_caminho','chegou','em_andamento','aguardando'].includes(o.status));
  const done=os.filter(o=>o.status==='concluido');
  const totalConcluidos=isPro?Math.max(done.length,Number(u.jobs)||0):done.length;
  const avaliacao=Number(u.rating)||0;
  const avaliacaoLabel=avaliacao>0?avaliacao.toFixed(1)+' ★':'—';
  const avaliacaoInfo=avaliacao>0?'Avaliação registrada':'Sem avaliações ainda';
  const activeTitle=ativo?({aguardando:isPro?'Novo pedido recebido':'Aguardando confirmação',a_caminho:isPro?'A caminho do cliente':'Profissional a caminho',chegou:isPro?'Chegada confirmada':'Profissional chegou',em_andamento:'Serviço em andamento'}[ativo.status]||'Pedido ativo'):'';
  const activeMessage=ativo?({aguardando:isPro?'Revise os detalhes e confirme se pode atender.':'Seu pedido foi enviado. Avisaremos quando o profissional confirmar.',a_caminho:isPro?'Siga para o endereço do cliente.':'O profissional está a caminho; consulte o pedido para verificar a localização compartilhada.',chegou:isPro?'Aguarde o código de segurança do cliente para iniciar.':'O profissional informou que chegou. Informe o código de segurança para iniciar.',em_andamento:isPro?'O atendimento está em andamento.':'O serviço está em andamento.'}[ativo.status]||'Veja os detalhes para acompanhar este pedido.') : '';
  const stat=(lbl,val,delta,icon,color)=>'<div class="stat"><div class="si" style="background:color-mix(in srgb,'+color+' 16%,transparent)">'+ic(icon).replace('class="ic "','class="ic" style="stroke:'+color+'"')+'</div>'+
    '<div class="lbl">'+lbl+'</div><div class="val">'+val+'</div>'+(delta?'<div class="delta" style="color:'+color+'">'+delta+'</div>':'')+'</div>';
  return dashHead('Olá, '+esc(u.name.split(' ')[0]),isPro?'Aqui está o resumo dos seus atendimentos e ganhos.':'Acompanhe seus pedidos e sua carteira.',
    isPro?'<a class="btn btn-ghost" href="#/painel/oportunidades">'+ic('target')+' Ver oportunidades</a>':'<a class="btn btn-grad" href="#/contratar">'+ic('plus')+' Novo pedido</a>')+
  (isPro?'<div class="card" style="margin-bottom:22px"><b>Disponibilidade</b><p class="muted" style="font-size:.88rem;margin-top:6px">O sistema ainda não registra disponibilidade, localização ou verificação de identidade.</p></div>':'')+
  '<div class="grid g4" style="margin-bottom:24px">'+
    stat('Saldo indisponível','—','Carteira não habilitada','wallet','var(--accent)')+
    stat(isPro?'Recebimentos indisponíveis':'Pedidos ativos',isPro?'—':String(os.filter(o=>['aguardando','a_caminho','chegou','em_andamento','agendado'].includes(o.status)).length),isPro?'Pagamentos não habilitados':'Em andamento','clock','var(--brand)')+
    stat(isPro?'Atendimentos concluídos':'Serviços concluídos',String(totalConcluidos),'Histórico total','checkCircle','var(--purple)')+
    stat('Avaliação média',avaliacaoLabel,avaliacaoInfo,'star','var(--warn)')+
  '</div>'+
  (ativo?'<div class="card" style="margin-bottom:24px;border-color:color-mix(in srgb,var(--brand) 40%,var(--line))">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:18px">'+
    '<div style="display:flex;align-items:center;gap:12px">'+avatar({name:counterpart(ativo).name},44)+
    '<div><b style="display:block">'+esc(counterpart(ativo).name)+'</b><span class="muted" style="font-size:.82rem">'+counterLabel()+' · '+svc(ativo.service).n+' · '+money(ativo.price)+'</span></div></div>'+
    stTag(ativo.status)+'</div>'+
    '<div style="display:flex;gap:12px;align-items:flex-start;padding:16px;border-radius:12px;background:var(--surface-2)"><div class="ico-box">'+ic(ativo.status==='chegou'?'checkCircle':ativo.status==='aguardando'?'clock':'nav')+'</div><div><b>'+activeTitle+'</b><p class="muted" style="font-size:.86rem;margin-top:5px">'+activeMessage+'</p></div></div>'+
    '<div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap"><a class="btn btn-primary" href="#/painel/pedido/'+ativo.id+'">'+ic(ativo.status==='aguardando'?'list':'nav')+' '+(ativo.status==='aguardando'?(isPro?'Ver pedido e confirmar':'Ver pedido'):'Acompanhar pedido')+'</a>'+
    (ativo.status==='aguardando'?'':'<a class="btn btn-ghost" href="#/painel/mensagens">'+ic('chat')+' Conversar</a>')+'</div></div>':'')+
  '<div class="grid g2" style="align-items:start">'+
  '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3 style="font-size:1.05rem">Últimos pedidos</h3><a href="#/painel/pedidos" style="font-size:.84rem;color:var(--brand)">Ver todos</a></div>'+
  (os.slice(0,4).map(o=>orderRow(o)).join('')||'<div class="emptystate">'+ic('list')+'Nenhum pedido ainda</div>')+'</div>'+
  '<div class="card"><h3 style="font-size:1.05rem;margin-bottom:16px">Atalhos</h3>'+
  [[isPro?'Receber pagamento':'Adicionar saldo','pix','abrirPix()'],['Sacar via PIX','down','abrirSaque()'],['Editar meu perfil','user',"go('/painel/config')"],['Indicar amigos','gift',"go('/painel/indicacoes')"],['Central de ajuda','help',"go('/ajuda')"]]
  .map(a=>'<button class="rowitem" style="width:100%;text-align:left;cursor:pointer;background:var(--surface)" onclick="'+a[2]+'"><div class="ico-box" style="width:38px;height:38px;border-radius:11px">'+ic(a[1])+'</div><div class="grow"><b>'+a[0]+'</b></div>'+ic('arrow')+'</button>').join('')+
  '</div></div>';
}
function orderRow(o){
  const cp=counterpart(o),s=svc(o.service);
  const isPro=me().role==='profissional';
  const requestPending=o.status==='aguardando';
  const reviewPending=o.status==='concluido'&&(isPro?!(o.clientRating||(o.reviewByRole==='profissional'&&o.rating)):!(o.rating&&o.reviewByRole!=='profissional'));
  const notice=requestPending?(isPro?'Novo pedido · confirme o atendimento':'Aguardando confirmação do profissional'):reviewPending?'Pedido finalizado · '+(isPro?'Avalie o cliente':'Avalie o profissional'):'';
  return '<a class="rowitem" href="#/painel/pedido/'+o.id+'"><div class="ico-box" style="width:42px;height:42px;border-radius:12px">'+ic(s.ico)+'</div>'+
  '<div class="grow"><b>'+s.n+'</b><small>'+counterLabel()+': '+esc(cp.name)+' · '+dt(o.created)+'</small>'+(notice?'<small style="display:block;color:var(--brand);font-weight:700;margin-top:4px">'+notice+'</small>':'')+'</div>'+
  '<div style="text-align:right"><b style="display:block;font-size:.92rem">'+money(o.price)+'</b>'+stTag(o.status)+'</div></a>';
}

