/* =========================================================
   PÁGINAS PÚBLICAS
   ========================================================= */
/* Quem prefere menos movimento começa com tudo parado; qualquer pessoa pode pausar. */
const MOVIMENTO={pausado:window.matchMedia('(prefers-reduced-motion: reduce)').matches};
function botaoMovimento(){
  return ic(MOVIMENTO.pausado?'play':'pause')+'<span>'+(MOVIMENTO.pausado?'Retomar animações':'Pausar animações')+'</span>';
}
function alternarMovimento(botao){
  MOVIMENTO.pausado=!MOVIMENTO.pausado;
  botao.innerHTML=botaoMovimento();
  $('.marquee')?.classList.toggle('is-paused',MOVIMENTO.pausado);
  const video=$('.hero-bg-video');
  if(video){if(MOVIMENTO.pausado)video.pause();else video.play().catch(()=>{});}
}
/* Prévia do fluxo do profissional: protótipo com dados fictícios, sem chamar a API. */
const FLUXO_ETAPAS=[
  ['Pedido','','Troca de chuveiro · Boa Viagem',''],
  ['Aceite','Você decide: aceitar ou recusar','Você aceitou este pedido','Aceitar pedido'],
  ['Endereço','Só aparece depois do aceite','Rua de Exemplo, 100','Ver endereço'],
  ['Conversa','Abre depois do aceite','Cliente: o chuveiro fica no banheiro de cima.','Abrir conversa'],
  ['Status','Aguardando','A caminho. Você atualiza a cada etapa.','Atualizar status']
];
let fluxoEtapa=0;
function fluxoLinhas(){
  return FLUXO_ETAPAS.map((e,i)=>'<li class="lp-ticket-row'+(i<=fluxoEtapa?' is-done':'')+'"><span class="lp-ticket-k">'+e[0]+'</span><span>'+(i<=fluxoEtapa?e[2]:e[1])+'</span></li>').join('');
}
function fluxoRotulo(){return fluxoEtapa<FLUXO_ETAPAS.length-1?FLUXO_ETAPAS[fluxoEtapa+1][3]:'Ver de novo';}
function fluxoProfissional(){
  return '<div class="lp-ticket"><div class="lp-ticket-head"><b>Pedido de exemplo</b><span class="lp-status">Protótipo</span></div>'+
  '<ol class="lp-ticket-rows" id="fluxoLinhas">'+fluxoLinhas()+'</ol>'+
  '<button type="button" class="btn btn-ghost btn-block" id="fluxoBtn" onclick="avancarFluxo()">'+fluxoRotulo()+'</button>'+
  '<p class="lp-ticket-note">Dados fictícios: mostra como o fluxo foi pensado.</p>'+
  '<p class="lp-sr" role="status" id="fluxoAviso"></p></div>';
}
function avancarFluxo(){
  fluxoEtapa=fluxoEtapa<FLUXO_ETAPAS.length-1?fluxoEtapa+1:0;
  $('#fluxoLinhas').innerHTML=fluxoLinhas();
  $('#fluxoBtn').textContent=fluxoRotulo();
  const e=FLUXO_ETAPAS[fluxoEtapa];
  $('#fluxoAviso').textContent=e[0]+': '+e[2];
}
function pageHome(){
  const pop=SERVICES.filter(s=>s.pop).concat(SERVICES.filter(s=>!s.pop)).slice(0,8);
  const heroVideo='<video class="hero-bg-video"'+(MOVIMENTO.pausado?'':' autoplay')+' muted loop playsinline preload="metadata" aria-hidden="true"><source src="assets/8853466-hd_1920_1080_24fps.mp4" type="video/mp4"></video>';
  return '<section class="hero"><div class="hero-bg">'+heroVideo+'</div><div class="hero-grid"></div><div class="wrap"><div class="hero-inner">'+
  '<div><span class="pill pill-brand">'+ic('sparkle')+' Em desenvolvimento</span>'+
  '<h1>Uma nova forma de conectar <span>clientes e profissionais</span>.</h1>'+
  '<p class="hero-sub">A TaskGO está construindo uma plataforma para aproximar profissionais autônomos de quem precisa de serviços locais. O projeto está em desenvolvimento, e queremos ouvir quem vai usá-la antes do lançamento.</p>'+
  '<div class="hero-cta lp-hero-paths"><a class="btn btn-primary btn-lg" href="#/profissionais">Sou profissional '+ic('arrow')+'</a><a class="btn btn-ghost btn-lg" href="#/servicos">Preciso de um serviço</a></div>'+
  '<button type="button" class="lp-motion" onclick="alternarMovimento(this)">'+botaoMovimento()+'</button></div>'+
  '</div></div></section>'+

  '<div class="marquee'+(MOVIMENTO.pausado?' is-paused':'')+'"><div class="marquee-track">'+
    [false,true].map(copia=>'<div class="marquee-set"'+(copia?' aria-hidden="true"':'')+'>'+SERVICES.map(s=>'<span class="marquee-item">'+ic(s.ico)+' '+s.n+'</span>').join('')+'</div>').join('')+
  '</div></div>'+

  /* PROFISSIONAIS */
  '<section class="section"><div class="wrap"><div class="ribbon lp-flow">'+
  '<div class="lp-flow-copy"><h2>Você escolhe o pedido. O endereço só aparece depois do aceite.</h2>'+
  '<p>A TaskGO está sendo feita primeiro para profissionais autônomos. Ainda não há pedidos reais nem pagamentos, e você pode ajudar a definir como isto vai funcionar.</p>'+
  '<div class="lp-actions lp-actions-start">'+
  '<a class="btn btn-primary btn-lg" href="#/profissionais">Ver como é para profissionais '+ic('arrow')+'</a>'+
  '<a class="btn btn-lg lp-btn-line" href="#/contato">Participar da validação</a></div></div>'+
  fluxoProfissional()+
  '</div></div></section>'+

  /* SERVIÇOS */
  '<section class="section"><div class="wrap">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('grid')+' Ideias de categorias</span><h2>Serviços que queremos reunir na TaskGO</h2>'+
  '<p>A presença no catálogo não significa que já existam profissionais cadastrados ou disponíveis.</p></div>'+
  '<div class="grid g4">'+pop.map(s=>svcCard(s)).join('')+'</div>'+
  '<div class="lp-actions"><a class="btn btn-ghost btn-lg" href="#/servicos">Ver todas as categorias '+ic('arrow')+'</a></div>'+
  '</div></section>'+

  /* COMO FUNCIONA */
  '<section class="section"><div class="wrap">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('route')+' Como funciona</span><h2>Uma proposta em construção</h2></div>'+
  '<div class="steps">'+[
    ['Encontre uma categoria','Explore as áreas de serviço que fazem parte da proposta TaskGO.'],
    ['Conheça o projeto','Saiba em que etapa estamos e como pretendemos aproximar clientes e profissionais.'],
    ['Participe da validação','Sua experiência pode ajudar a orientar os próximos passos do projeto.']
  ].map(s=>'<div class="step"><h3>'+s[0]+'</h3><p>'+s[1]+'</p></div>').join('')+'</div>'+
  '<div class="lp-actions"><a class="btn btn-primary btn-lg" href="#/servicos">Explorar categorias '+ic('arrow')+'</a></div>'+
  '</div></section>'+

  /* DIFERENCIAIS */
  '<section class="section"><div class="wrap">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('zap2')+' A proposta</span><h2>Uma jornada mais clara para serviços locais</h2>'+
  '<p>Os recursos abaixo são objetivos do produto, não serviços já disponíveis.</p></div>'+
  '<div class="grid g3">'+[
    ['search','Busca por categoria','A proposta é ajudar clientes a encontrar categorias de serviço em um só lugar.'],
    ['sparkle','Referência de preço','Estamos avaliando como apresentar referências sem confundi-las com propostas de profissionais.'],
    ['users','Perfis profissionais','Queremos reunir informações que ajudem clientes e profissionais a se conhecerem.'],
    ['route','Acompanhamento','Organizar as etapas de um atendimento é um objetivo para a evolução do produto.'],
    ['shield','Segurança','Verificação de identidade, garantias e proteção de pagamento ainda não estão disponíveis.'],
    ['chat','Comunicação','A comunicação integrada faz parte da proposta e ainda está em desenvolvimento.']
  ].map(f=>'<div class="card card-hover lp-feature"><div class="ico-box">'+ic(f[0])+'</div><h3>'+f[1]+'</h3><p>'+f[2]+'</p></div>').join('')+'</div>'+
  '</div></section>'+

  /* SEGURANÇA SPLIT */
  '<section class="section"><div class="wrap"><div class="split lp-panel">'+
  '<div class="lp-copy"><span class="eyebrow">'+ic('shield')+' Estado atual</span><h2>Transparência enquanto construímos.</h2>'+
  '<p class="muted">A TaskGO ainda não está aberta para contratação. Estamos desenvolvendo e validando a plataforma antes do lançamento.</p>'+
  '<ul class="list-check lp-list-neutral">'+[
    'Ainda não há clientes nem profissionais cadastrados',
    'Contratação e pagamentos não estão disponíveis',
    'Verificação de identidade e garantias ainda não foram implementadas'
  ].map(t=>'<li>'+ic('x')+'<span>'+t+'</span></li>').join('')+'</ul>'+
  '<a class="btn btn-ghost" href="#/sobre">Conheça o projeto '+ic('arrow')+'</a></div>'+
  '<div class="card lp-stage">'+
    '<div class="lp-stage-head">'+ic('route')+'<b>Etapa atual do TaskGO</b></div>'+
    '<p class="muted">Construção e validação da proposta com potenciais clientes e profissionais.</p>'+
  '</div></div></div></section>'+

  /* DESAFIOS E PROPOSTA */
  '<section class="section"><div class="wrap">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('route')+' Desafio × proposta</span><h2>O que queremos melhorar com a TaskGO</h2></div>'+
  '<div class="grid g3">'+[
    ['search','Encontrar um profissional','Buscar por indicação pode deixar informações e opções espalhadas.','Reunir busca por categoria e região, com informações para ajudar na escolha.'],
    ['sparkle','Ter uma referência de preço','Sem uma referência inicial, fica mais difícil planejar o serviço.','Apresentar uma estimativa antes do pedido e permitir combinar o valor com clareza.'],
    ['chat','Acompanhar o atendimento','Pedido, conversa e pagamento podem acabar em canais diferentes.','Organizar as etapas e a comunicação do serviço em um só fluxo.']
  ].map(t=>'<article class="card lp-challenge"><div class="lp-challenge-head">'+ic(t[0])+'<h3>'+t[1]+'</h3></div>'+
    '<div class="lp-challenge-item"><span class="lp-label">Desafio</span><p>'+t[2]+'</p></div>'+
    '<div class="lp-challenge-item lp-challenge-answer"><span class="lp-label">Proposta TaskGO</span><p>'+t[3]+'</p></div></article>').join('')+'</div>'+
  '</div></section>'+

  /* FAQ */
  '<section class="section"><div class="wrap lp-faq">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('help')+' Dúvidas</span><h2>Perguntas frequentes</h2></div>'+faqList([7,6,2,0,1,5].map(i=>FAQ[i]))+
  '<div class="lp-actions"><a class="btn btn-ghost" href="#/ajuda">Ver central de ajuda completa</a></div>'+
  '</div></section>';
}
function svcCard(s,nivel){
  const t=nivel||3;
  return '<a class="card card-hover svc" href="#/servicos/'+s.id+'"><div class="ico-box">'+ic(s.ico)+'</div>'+
  '<h'+t+(t===2?' class="lp-card-title"':'')+'>'+s.n+'</h'+t+'><p>'+s.d+'</p>'+
  '<div class="price"><span class="tag tag-muted">'+s.cat+'</span></div></a>';
}

