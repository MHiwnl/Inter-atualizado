/* ---------- SERVIÇOS ---------- */
function pageServicos(){
  if(route.sub)return pageServicoDetalhe(route.sub);
  const cats=['Todos'].concat(Array.from(new Set(SERVICES.map(s=>s.cat))));
  return '<section class="section"><div class="wrap">'+
  '<div class="sec-head"><span class="eyebrow">'+ic('grid')+' Categorias previstas</span><h1 class="lp-page-title">Serviços que queremos reunir na TaskGO</h1>'+
  '<p>Explore as categorias planejadas. Ainda não há profissionais cadastrados nem contratação disponível.</p></div>'+
  '<div class="lp-filter" id="catBar" role="group" aria-label="Filtrar por categoria">'+
    cats.map((c,i)=>'<button class="pill '+(i===0?'pill-brand':'')+'" data-cat="'+c+'" aria-pressed="'+(i===0)+'" onclick="filterCat(this)">'+c+'</button>').join('')+'</div>'+
  '<div class="grid g4" id="svcGrid">'+SERVICES.map(s=>'<div data-cat="'+s.cat+'">'+svcCard(s,2)+'</div>').join('')+'</div>'+
  '</div></section>';
}
function filterCat(btn){
  const c=btn.dataset.cat;
  $$('#catBar .pill').forEach(b=>{b.classList.toggle('pill-brand',b===btn);b.setAttribute('aria-pressed',String(b===btn));});
  $$('#svcGrid > div').forEach(d=>{d.style.display=(c==='Todos'||d.dataset.cat===c)?'':'none';});
}
function pageServicoDetalhe(id){
  const s=svc(id),pros=S.pros.filter(p=>p.service===id).slice(0,4);
  return '<section class="section"><div class="wrap">'+
  '<a href="#/servicos" class="pill lp-back">'+ic('arrowLeft')+' Todos os serviços</a>'+
  '<div class="split lp-panel">'+
  '<div class="lp-copy"><div class="ico-box">'+ic(s.ico)+'</div>'+
  '<h1 class="lp-page-title">'+s.n+'</h1><p class="t2">'+s.d+'</p>'+
  '<div class="lp-pills">'+
    '<span class="pill">Categoria prevista</span></div>'+
  '<div class="card lp-feature"><h2 class="lp-card-title">Sobre esta categoria</h2><p>Esta página apresenta uma categoria planejada para a plataforma. Valores, disponibilidade e contratação ainda não estão disponíveis.</p></div></div>'+
  '<div class="card lp-feature lp-detail-side"><h2 class="lp-card-title">Estado da categoria</h2><p>Disponibilidade antes do lançamento</p>'+
  (DEMO_MODE&&pros.length?pros.map(p=>proRow(p)).join(''):'<p class="muted">Ainda não há profissionais cadastrados nesta categoria.</p><p class="t2">Trabalha com isso? Crie sua conta e ajude a definir como a categoria vai funcionar. Se precisa deste serviço, conte para a equipe.</p><div class="lp-actions lp-actions-start"><a class="btn btn-primary" href="#/entrar?tipo=profissional">Criar conta de profissional</a><a class="btn btn-ghost" href="#/contato">Preciso deste serviço</a></div>')+
  '</div></div></div></section>';
}
function proRow(p,sel,quotedPrice){
  const rating=Number(p.rating),reviews=Number(p.reviews)||0;
  return '<div class="pro '+(sel?'sel':'')+'">'+avatar({name:p.name},46)+
  '<div style="flex:1;min-width:0"><b style="display:block;font-size:.95rem">'+esc(p.name)+'</b>'+
  '<span class="muted" style="font-size:.8rem">'+(reviews?stars(rating)+' '+rating.toFixed(1)+' · '+reviews+' avaliações':'Sem avaliações registradas')+'</span>'+
  '<div style="display:flex;gap:10px;margin-top:6px;flex-wrap:wrap"><span class="tag tag-muted">'+esc(p.city||'Cidade não informada')+'</span></div></div>'+
  '<div style="text-align:right"><div class="muted" style="font-size:.68rem">Preço</div><b style="font-size:.9rem">A combinar</b></div></div>';
}
