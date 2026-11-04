/* =========================================================
   PÁGINAS PÚBLICAS
   ========================================================= */
function pageHome(){
  const pop=SERVICES.filter(s=>s.pop).concat(SERVICES.filter(s=>!s.pop)).slice(0,8);
  const heroVideo='<video class="hero-bg-video" autoplay muted loop playsinline preload="metadata" aria-hidden="true"><source src="assets/8853466-hd_1920_1080_24fps.mp4" type="video/mp4"></video>';
  return '<section class="hero"><div class="hero-bg">'+heroVideo+'</div><div class="hero-grid"></div><div class="wrap"><div class="hero-inner">'+
  '<div><span class="pill pill-brand">'+ic('sparkle')+' MVP em desenvolvimento</span>'+
  '<h1>Uma nova forma de conectar <span>clientes e profissionais</span>.</h1>'+
  '<p class="hero-sub">A TaskGO está construindo uma plataforma para aproximar quem precisa de serviços locais de profissionais autônomos. Estamos validando a proposta antes do lançamento.</p>'+
  '<form class="searchbox" onsubmit="heroSearch(event)">'+
    '<div class="field"><label>Tipo de serviço</label>'+
      '<select class="select" id="hSvc">'+SERVICES.map(s=>'<option value="'+s.id+'">'+s.n+'</option>').join('')+'</select></div>'+
    '<button class="btn btn-grad" type="submit">'+ic('arrow')+' Consultar categoria</button>'+
  '</form>'+
  '<div class="trust"><div><b>MVP</b><span>em desenvolvimento</span></div><div><b>Recife</b><span>origem do projeto</span></div><div><b>Em validação</b><span>proposta da plataforma</span></div></div></div>'+ 
  '<div style="position:relative"></div></div></div></section>'+

  '<div class="marquee"><div class="marquee-track">'+
    Array(2).fill(SERVICES.map(s=>'<span class="marquee-item">'+ic(s.ico)+' '+s.n+'</span>').join('')).join('')+
  '</div></div>'+

  /* SERVIÇOS */
  '<section class="section"><div class="wrap">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('grid')+' Ideias de categorias</span><h2>Serviços que queremos reunir na TaskGO</h2>'+
  '<p>Estas categorias fazem parte da proposta do MVP. A presença no catálogo não significa que já existam profissionais cadastrados ou disponíveis.</p></div>'+
  '<div class="grid g4">'+pop.map(s=>svcCard(s)).join('')+'</div>'+
  '<div class="center" style="margin-top:34px"><a class="btn btn-ghost btn-lg" href="#/servicos">Ver todas as categorias '+ic('arrow')+'</a></div>'+
  '</div></section>'+

  /* COMO FUNCIONA */
  '<section class="section" style="background:var(--bg-soft);border-block:1px solid var(--line)"><div class="wrap">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('route')+' Como funciona</span><h2>Uma proposta em construção</h2>'+
  '<p>Estamos validando os primeiros passos da plataforma antes de abrir a contratação ao público.</p></div>'+
  '<div class="steps">'+[
    ['Encontre uma categoria','Explore as áreas de serviço que fazem parte da proposta TaskGO.'],
    ['Conheça o projeto','Saiba em que etapa estamos e como pretendemos aproximar clientes e profissionais.'],
    ['Participe da validação','Sua experiência pode ajudar a orientar os próximos passos do MVP.']
  ].map(s=>'<div class="step"><h3>'+s[0]+'</h3><p>'+s[1]+'</p></div>').join('')+'</div>'+
  '<div class="center" style="margin-top:38px"><a class="btn btn-primary btn-lg" href="#/servicos">Explorar categorias '+ic('arrow')+'</a></div>'+
  '</div></section>'+

  /* DIFERENCIAIS */
  '<section class="section"><div class="wrap">'+
  '<div class="sec-head"><span class="eyebrow">'+ic('zap2')+' A proposta</span><h2>Uma jornada mais clara para serviços locais</h2>'+
  '<p>Os recursos abaixo são objetivos do produto, não serviços já disponíveis.</p></div>'+
  '<div class="grid g3">'+[
    ['search','Busca por categoria','A proposta é ajudar clientes a encontrar categorias de serviço em um só lugar.'],
    ['sparkle','Referência de preço','Estamos avaliando como apresentar referências sem confundi-las com propostas de profissionais.'],
    ['users','Perfis profissionais','Queremos reunir informações que ajudem clientes e profissionais a se conhecerem.'],
    ['route','Acompanhamento','Organizar as etapas de um atendimento é um objetivo para a evolução do produto.'],
    ['shield','Segurança','Verificação de identidade, garantias e proteção de pagamento ainda não estão disponíveis.'],
    ['chat','Comunicação','A comunicação integrada faz parte da proposta e ainda está em desenvolvimento.']
  ].map(f=>'<div class="card card-hover"><div class="ico-box">'+ic(f[0])+'</div><h3 style="margin:16px 0 8px">'+f[1]+'</h3><p class="muted" style="font-size:.92rem">'+f[2]+'</p></div>').join('')+'</div>'+
  '</div></section>'+

  /* SEGURANÇA SPLIT */
  '<section class="section" style="background:var(--bg-soft);border-block:1px solid var(--line)"><div class="wrap"><div class="split">'+
  '<div><span class="eyebrow">'+ic('shield')+' Estado atual</span><h2 style="margin-top:14px">Transparência enquanto construímos.</h2>'+
  '<p class="muted" style="margin-top:14px">A TaskGO ainda não está aberta para contratação. Estamos desenvolvendo e validando o MVP antes do lançamento.</p>'+
  '<ul class="list-check">'+[
    'Ainda não há clientes nem profissionais cadastrados',
    'Contratação e pagamentos não estão disponíveis',
    'Verificação de identidade e garantias ainda não foram implementadas',
    'Os dados desta página descrevem a proposta do projeto'
  ].map(t=>'<li>'+ic('checkCircle')+'<span>'+t+'</span></li>').join('')+'</ul>'+
  '<a class="btn btn-ghost" style="margin-top:26px" href="#/sobre">Conheça o projeto '+ic('arrow')+'</a></div>'+
  '<div class="card" style="padding:26px">'+
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">'+ic('route')+'<b>Etapa atual do TaskGO</b></div>'+
    '<p class="muted" style="font-size:.9rem">Construção e validação da proposta com potenciais clientes e profissionais.</p>'+
    '<div style="margin-top:22px;padding:14px;border-radius:14px;background:color-mix(in srgb,var(--brand) 10%,transparent);border:1px solid color-mix(in srgb,var(--brand) 26%,transparent);font-size:.86rem">MVP em desenvolvimento · Recife</div>'+
  '</div></div></div></section>'+

  /* DESAFIOS E PROPOSTA */
  '<section class="section"><div class="wrap">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('route')+' Desafio × proposta</span><h2>O que queremos melhorar com a TaskGO</h2>'+
  '<p>Como estamos desenvolvendo o MVP e ainda não temos clientes, apresentamos aqui os desafios que queremos resolver e a proposta da TaskGO.</p></div>'+
  '<div class="grid g3">'+[
    ['search','Encontrar um profissional','Buscar por indicação pode deixar informações e opções espalhadas.','Reunir busca por categoria e região, com informações para ajudar na escolha.'],
    ['sparkle','Ter uma referência de preço','Sem uma referência inicial, fica mais difícil planejar o serviço.','Apresentar uma estimativa antes do pedido e permitir combinar o valor com clareza.'],
    ['chat','Acompanhar o atendimento','Pedido, conversa e pagamento podem acabar em canais diferentes.','Organizar as etapas e a comunicação do serviço em um só fluxo.']
  ].map(t=>'<article class="card" style="height:100%"><div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;color:var(--brand)">'+ic(t[0])+'<h3 style="font-size:1.05rem;color:var(--text)">'+t[1]+'</h3></div>'+
    '<div style="margin-bottom:16px"><span class="muted" style="font-size:.76rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Desafio</span><p style="font-size:.9rem;color:var(--text-2);margin-top:6px">'+t[2]+'</p></div>'+
    '<div style="padding-top:14px;border-top:1px solid var(--line)"><span style="font-size:.76rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--brand)">Proposta TaskGO</span><p style="font-size:.9rem;color:var(--text-2);margin-top:6px">'+t[3]+'</p></div></article>').join('')+'</div>'+
  '</div></section>'+

  /* PRO CTA */
  '<section class="section" style="padding-top:0"><div class="wrap"><div class="ribbon">'+
  '<span class="pill" style="background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.3);color:#fff">'+ic('award')+' Para profissionais</span>'+
  '<h2 style="margin-top:16px">Ajude a construir a TaskGO</h2>'+
  '<p>Somos um MVP em desenvolvimento e queremos validar a proposta com potenciais profissionais. Ainda não há pedidos ou pagamentos disponíveis.</p>'+
  '<div style="display:flex;gap:12px;justify-content:center;margin-top:26px;flex-wrap:wrap">'+
  '<a class="btn btn-ghost btn-lg" href="#/sobre">Conhecer o projeto '+ic('arrow')+'</a>'+
  '<a class="btn btn-lg" style="background:rgba(255,255,255,.16);color:#fff" href="#/contato">Quero participar da validação</a></div>'+
  '</div></div></section>'+

  /* FAQ */
  '<section class="section" style="padding-top:0"><div class="wrap" style="max-width:820px">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('help')+' Dúvidas</span><h2>Perguntas frequentes</h2></div>'+faqList(FAQ.slice(0,6))+
  '<div class="center" style="margin-top:24px"><a class="btn btn-ghost" href="#/ajuda">Ver central de ajuda completa</a></div>'+
  '</div></section>';
}
function svcCard(s){
  return '<a class="card card-hover svc" href="#/servicos/'+s.id+'"><div class="ico-box">'+ic(s.ico)+'</div>'+
  '<h3>'+s.n+'</h3><p>'+s.d+'</p>'+
  '<div class="price"><span>Categoria do MVP</span><span class="tag tag-muted">'+s.cat+'</span></div></a>';
}
function heroSearch(e){
  e.preventDefault();
  const s=$('#hSvc').value;
  go('/servicos/'+encodeURIComponent(s));
}

