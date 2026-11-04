/* ---------- AJUDA ---------- */
function pageAjuda(){
  return '<section class="section"><div class="wrap" style="max-width:880px">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('help')+' Central de ajuda</span><h2>Como podemos ajudar?</h2></div>'+
  '<div class="grid g3" style="margin-bottom:44px">'+[
    ['wallet','Pagamentos e PIX'],['nav','Pedidos e rastreio'],['user','Conta e cadastro'],
    ['shield','Segurança'],['award','Ser profissional'],['file','Notas e documentos']
  ].map(x=>'<a class="card card-hover center" href="#faqTop"><div class="ico-box" style="margin:0 auto 12px">'+ic(x[0])+'</div><b style="font-size:.95rem">'+x[1]+'</b></a>').join('')+'</div>'+
  '<h3 id="faqTop" style="margin-bottom:20px">Perguntas frequentes</h3>'+faqList(FAQ)+
  '<div class="card" style="margin-top:34px;display:flex;gap:16px;align-items:center;flex-wrap:wrap">'+ic('chat')+
  '<div style="flex:1;min-width:220px"><b>Não achou o que procurava?</b><p class="muted" style="font-size:.9rem">Fale com um atendente humano em até 5 minutos.</p></div>'+
  '<a class="btn btn-primary" href="#/contato">Falar com o suporte</a></div>'+
  '</div></section>';
}

