/* ---------- AVALIAÇÕES ---------- */
function dashAvaliacoes(){
  const u=me(),isPro=u.role==='profissional';
  const revs=myOrders().filter(o=>o.rating&&o.reviewByRole!=='profissional').map(o=>({
    n:counterpart(o).name,r:o.rating,s:svc(o.service).n,
    t:o.comment||'',d:Math.max(1,Math.round((Date.now()-o.created)/864e5))
  }));
  const dist=[5,4,3,2,1].map(n=>({n,q:revs.filter(r=>r.r===n).length}));
  const total=revs.length||1;
  return dashHead('Avaliações',isPro?'O que os clientes dizem sobre o seu trabalho.':'Avaliações que você deixou para profissionais.')+
  '<div class="grid g2" style="grid-template-columns:.65fr 1.35fr;align-items:start">'+
  '<div class="card center"><div style="font-size:3.2rem;font-weight:800;letter-spacing:-.05em">'+(revs.length?(revs.reduce((a,b)=>a+b.r,0)/revs.length).toFixed(1):'—')+'</div>'+ 
  (revs.length?stars(revs.reduce((a,b)=>a+b.r,0)/revs.length):'')+'<p class="muted" style="font-size:.86rem;margin-top:8px">'+revs.length+' avaliações</p>'+ 
  '<div style="margin-top:20px;text-align:left">'+dist.map(d=>'<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><span style="font-size:.8rem;width:14px">'+d.n+'</span>'+
  '<div class="bar" style="flex:1"><i style="width:'+(d.q/total*100)+'%"></i></div><span class="muted" style="font-size:.78rem;width:20px">'+d.q+'</span></div>').join('')+'</div></div>'+
  '<div>'+(revs.length?revs.map(r=>'<div class="card" style="margin-bottom:12px"><div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">'+
  avatar({name:r.n},40)+'<div style="flex:1"><b style="font-size:.92rem;display:block">'+esc(r.n)+'</b>'+
  '<span class="muted" style="font-size:.78rem">'+(r.s?r.s+' · ':'')+'há '+r.d+' dias</span></div>'+stars(r.r)+'</div>'+
  '<p class="t2" style="font-size:.92rem">'+esc(r.t)+'</p></div>').join('')
  :'<div class="card emptystate">'+ic('star')+'Nenhuma avaliação ainda</div>')+'</div></div>';
}

