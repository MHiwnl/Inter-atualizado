/* ---------- SERVIÇOS ---------- */
function pageServicos(){
  if(route.sub)return pageServicoDetalhe(route.sub);
  const cats=['Todos'].concat(Array.from(new Set(SERVICES.map(s=>s.cat))));
  return '<section class="section"><div class="wrap">'+
  '<div class="sec-head"><span class="eyebrow">'+ic('grid')+' Categorias previstas</span><h2>Serviços que queremos reunir na TaskGO</h2>'+
  '<p>Explore as categorias planejadas para o MVP. Ainda não há profissionais cadastrados, estimativas personalizadas ou contratação disponível.</p></div>'+
  '<div class="lp-filter" id="catBar">'+
    cats.map((c,i)=>'<button class="pill '+(i===0?'pill-brand':'')+'" data-cat="'+c+'" onclick="filterCat(this)">'+c+'</button>').join('')+'</div>'+
  '<div class="grid g4" id="svcGrid">'+SERVICES.map(s=>'<div data-cat="'+s.cat+'">'+svcCard(s)+'</div>').join('')+'</div>'+
  '</div></section>';
}
function filterCat(btn){
  const c=btn.dataset.cat;
  $$('#catBar .pill').forEach(b=>b.classList.toggle('pill-brand',b===btn));
  $$('#svcGrid > div').forEach(d=>{d.style.display=(c==='Todos'||d.dataset.cat===c)?'':'none';});
}
function pageServicoDetalhe(id){
  const s=svc(id),pros=S.pros.filter(p=>p.service===id).slice(0,4);
  return '<section class="section"><div class="wrap">'+
  '<a href="#/servicos" class="pill lp-back">'+ic('arrowLeft')+' Todos os serviços</a>'+
  '<div class="split lp-panel">'+
  '<div class="lp-copy"><div class="ico-box">'+ic(s.ico)+'</div>'+
  '<h2>'+s.n+'</h2><p class="t2">'+s.d+'</p>'+
  '<div class="lp-pills">'+
    '<span class="pill">Categoria prevista no MVP</span>'+
    '<span class="pill">Ainda sem contratação disponível</span></div>'+
  '<div class="card lp-feature"><h3>Sobre esta categoria</h3><p>Esta página apresenta uma categoria planejada para a plataforma. Valores, disponibilidade e contratação ainda não estão disponíveis.</p></div></div>'+
  '<div class="card lp-feature lp-detail-side"><h3>Estado da categoria</h3><p>Disponibilidade antes do lançamento</p>'+
  (DEMO_MODE&&pros.length?pros.map(p=>proRow(p)).join(''):'<p class="muted">Ainda não há profissionais cadastrados nesta categoria.</p>')+
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
