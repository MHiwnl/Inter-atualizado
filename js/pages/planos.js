/* ---------- PLANOS ---------- */
function pagePlanos(){
  if(!DEMO_MODE)return '<section class="section"><div class="wrap"><div class="sec-head center"><span class="eyebrow">'+ic('crown')+' Planos</span><h1 class="lp-page-title">Planos indisponíveis</h1><p>Os valores e as condições dos planos ainda estão em definição. Hoje nenhuma cobrança é feita pela plataforma.</p></div><div class="card lp-unavailable"><h2 class="lp-card-title">A assinatura TaskGO Plus ainda não está disponível</h2><p class="muted">O pagamento pela plataforma ainda não existe, então nenhuma assinatura pode ser ativada.</p><p class="t2">É profissional? Conte o que faria sentido pagar, e de que forma. Isso ajuda a definir os planos.</p><div class="lp-actions"><a class="btn btn-primary" href="#/contato">Opinar sobre os planos</a><a class="btn btn-ghost" href="#/como-funciona">Ver o que já funciona</a></div></div></div></section>';
  const planos=[
    {n:'Gratuito',p:'R$ 0',s:'/mês',d:'Para quem está começando',pop:false,f:['Pedidos ilimitados','Estimativa por IA','Localização compartilhada quando disponível','Código de chegada','Saque PIX em até 30 min','Taxa de 12% por serviço'],cta:'Começar grátis'},
    {n:'TaskGO Plus',p:'R$ 29,90',s:'/mês',d:'Para profissionais que vivem disso',pop:true,f:['Tudo do Gratuito','Taxa reduzida para 8%','Saque PIX instantâneo e sem taxa','Selo Plus em destaque na busca','Prioridade no envio de pedidos','Suporte prioritário 24/7','Relatórios de desempenho avançados'],cta:'Assinar Plus'},
    {n:'Empresas',p:'Sob consulta',s:'',d:'Condomínios, imobiliárias e franquias',pop:false,f:['Múltiplos usuários e centros de custo','Faturamento mensal consolidado','SLA de atendimento garantido','Gestor de conta dedicado','Integração via API','Relatórios personalizados'],cta:'Falar com vendas'}
  ];
  return '<section class="section"><div class="wrap">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('crown')+' Planos</span><h1 class="lp-page-title">Escolha o plano ideal</h1><p>Contratar na TaskGO é sempre grátis. Os planos são para profissionais e empresas que querem ir além.</p></div>'+
  '<div class="grid g3">'+planos.map(p=>'<div class="plan '+(p.pop?'pop':'')+'">'+(p.pop?'<span class="badge-pop">Exemplo</span>':'')+
  '<b class="lp-plan-name">'+p.n+'</b><div class="price">'+p.p+'<small>'+p.s+'</small></div>'+
  '<span class="muted lp-plan-desc">'+p.d+'</span>'+
  '<ul>'+p.f.map(f=>'<li>'+ic('check')+'<span>'+f+'</span></li>').join('')+'</ul>'+
  '<button class="btn '+(p.pop?'btn-grad':'btn-ghost')+' btn-block" onclick="assinar(\''+p.n+'\')">'+p.cta+'</button></div>').join('')+'</div>'+
  '<div class="card lp-gift">'+ic('gift')+
  '<div class="lp-gift-copy"><b>Indique e ganhe</b><p class="muted">A cada amigo que concluir o primeiro serviço, você ganha R$ 50 em créditos. Sem limite de indicações.</p></div>'+
  '<a class="btn btn-soft" href="#/painel/indicacoes">Ver meu código</a></div>'+
  '<div class="lp-faq lp-after-panel">'+faqList([FAQ[3],FAQ[5],FAQ[6]])+'</div>'+
  '</div></section>';
}
function assinar(n){
  if(n==='Empresas')return go('/contato');
  if(!me())return go('/entrar');
  openModal('<div class="modal-head"><div><h3>Assinar '+esc(n)+'</h3><p>Confirme a assinatura para ativar os benefícios imediatamente.</p></div><button class="icon-btn" aria-label="Fechar" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="card" style="background:var(--surface-2);margin-bottom:18px"><div style="display:flex;justify-content:space-between"><span>'+esc(n)+'</span><b>R$ 29,90/mês</b></div>'+
  '<p class="hint" style="margin-top:8px">Cobrança mensal recorrente. Cancele quando quiser, sem multa.</p></div>'+
  '<button class="btn btn-grad btn-block" onclick="confirmarPlano()">'+ic('pix')+' Pagar com PIX</button>');
}
function confirmarPlano(){toast('A assinatura ainda não está disponível: o pagamento pela plataforma não existe.','err');}

