/* ---------- SERVIÇOS ---------- */
function pageServicos(){
  if(route.sub)return pageServicoDetalhe(route.sub);
  const cats=['Todos'].concat(Array.from(new Set(SERVICES.map(s=>s.cat))));
  return folha('categorias previstas',duo('serviços que queremos','reunir na TaskGO',1)+
  '<p class="corpo">Explore as categorias planejadas. Ainda não há profissionais cadastrados nem contratação disponível.</p>','cabeca')+
  '<section class="folha-densa" style="padding-top:0"><div class="wrap folha-in"><div class="folha-corpo">'+
  '<div class="filtros" id="catBar" role="group" aria-label="Filtrar por categoria">'+
    cats.map((c,i)=>'<button class="pill '+(i===0?'pill-brand':'')+'" data-cat="'+c+'" aria-pressed="'+(i===0)+'" onclick="filterCat(this)">'+c+'</button>').join('')+'</div>'+
  '<div class="catalogo" id="svcGrid">'+SERVICES.map(s=>'<div data-cat="'+s.cat+'"><a href="#/servicos/'+s.id+'">'+ic(s.ico)+'<h2>'+s.n+'</h2><span class="tag tag-muted">'+s.cat+'</span><p>'+s.d+'</p></a></div>').join('')+'</div>'+
  '</div></div></section>';
}
function filterCat(btn){
  const c=btn.dataset.cat;
  $$('#catBar .pill').forEach(b=>{b.classList.toggle('pill-brand',b===btn);b.setAttribute('aria-pressed',String(b===btn));});
  $$('#svcGrid > div').forEach(d=>{d.style.display=(c==='Todos'||d.dataset.cat===c)?'':'none';});
}
function pageServicoDetalhe(id){
  const s=svc(id),pros=S.pros.filter(p=>p.service===id).slice(0,4);
  return folha('categoria prevista','<a href="#/servicos" class="seta" style="margin-bottom:24px"><i>'+ic('arrowLeft')+'</i><span>Todos os serviços</span></a>'+
  '<div class="duas-colunas"><div><h1 class="duo"><strong>'+s.n+'</strong></h1><p class="corpo">'+s.d+'</p>'+
  '<p class="corpo">Esta página apresenta uma categoria planejada para a plataforma. Valores, disponibilidade e contratação ainda não estão disponíveis.</p></div>'+
  '<div><h2 class="bloco-titulo">estado da categoria</h2>'+
  (DEMO_MODE&&pros.length?pros.map(p=>proRow(p)).join(''):'<p class="t2" style="font-size:.92rem">Ainda não há profissionais cadastrados nesta categoria.</p><p class="t2" style="font-size:.92rem;margin-top:14px">Trabalha com isso? Crie sua conta e ajude a definir como a categoria vai funcionar. Se precisa deste serviço, conte para a equipe.</p>'+
  '<div class="setas">'+linkSeta('#/entrar?tipo=profissional','Criar conta de profissional',1)+linkSeta('#/contato','Preciso deste serviço')+'</div>')+
  '</div></div>','cabeca');
}
function proRow(p,sel,quotedPrice){
  const rating=Number(p.rating),reviews=Number(p.reviews)||0;
  return '<div class="pro '+(sel?'sel':'')+'">'+avatar({name:p.name},46)+
  '<div style="flex:1;min-width:0"><b style="display:block;font-size:.95rem">'+esc(p.name)+'</b>'+
  '<span class="muted" style="font-size:.8rem">'+(reviews?stars(rating)+' '+rating.toFixed(1)+' · '+reviews+' avaliações':'Sem avaliações registradas')+'</span>'+
  '<div style="display:flex;gap:10px;margin-top:6px;flex-wrap:wrap"><span class="tag tag-muted">'+esc(p.city||'Cidade não informada')+'</span></div></div>'+
  '<div style="text-align:right"><div class="muted" style="font-size:.68rem">Preço</div><b style="font-size:.9rem">A combinar</b></div></div>';
}
