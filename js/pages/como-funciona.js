/* ---------- COMO FUNCIONA ---------- */
function pageComo(){
  const blocos=[
    ['Para quem contrata',[
      ['search','1. Descreva o que precisa','Escolha a categoria, informe o porte do serviço, a urgência e o endereço. A TaskGO entende seu pedido em segundos.'],
      ['sparkle','2. Veja a estimativa da IA','Antes de qualquer contato, você já sabe a faixa de preço justa para a sua região — sem precisar ligar para cinco lugares.'],
      ['users','3. Compare e escolha','Veja nota, número de serviços, distância, preço e avaliações reais. Você escolhe quem atende.'],
      ['nav','4. Acompanhe no mapa','Veja a ultima posicao compartilhada pelo profissional, quando disponivel. O app nao calcula rota ou ETA nesta versao.'],
      ['key','5. Valide o código','Na chegada, confirme o código de 4 dígitos. Só assim o serviço é iniciado oficialmente.'],
      ['pix','6. Pague com segurança','Pagamento via PIX, cartão ou boleto, retido até a conclusão. Avalie e pronto.']
    ]],
    ['Para quem trabalha',[
      ['file','1. Cadastro e verificacao','A verificacao documental e facial ainda nao esta disponivel nesta versao.'],
      ['target','2. Defina seu raio e preços','Escolha as categorias, a região de atendimento e o seu valor por hora ou por serviço.'],
      ['bell','3. Receba pedidos','Notificações em tempo real dos pedidos compatíveis com o seu perfil. Aceite os que fizerem sentido.'],
      ['route','4. Va ate o cliente','Com consentimento, compartilhe sua localizacao durante o status a caminho.'],
      ['checkCircle','5. Conclua o serviço','Registre fotos do antes e depois, finalize no app e receba a avaliação.'],
      ['wallet','6. Receba e saque','Carteira e saques ainda indispon?veis; ganhos demonstrativos n?o s?o dinheiro dispon?vel.']
    ]]
  ];
  return '<section class="section"><div class="wrap">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('route')+' Passo a passo</span><h2>Como funciona a TaskGO</h2>'+
  '<p>Transparência do início ao fim — para quem contrata e para quem trabalha.</p></div>'+
  blocos.map((b,bi)=>'<h3 style="margin:'+(bi?'60px':'0')+' 0 22px;font-size:1.3rem">'+b[0]+'</h3><div class="grid g3">'+
    b[1].map(x=>'<div class="card card-hover"><div class="ico-box">'+ic(x[0])+'</div><h3 style="margin:16px 0 8px;font-size:1.02rem">'+x[1]+'</h3><p class="muted" style="font-size:.9rem">'+x[2]+'</p></div>').join('')+'</div>').join('')+
  '<div class="ribbon" style="margin-top:60px"><h2>Pronto para começar?</h2><p>Faça seu primeiro pedido e receba a estimativa em segundos. Sem cadastro obrigatório para simular.</p>'+
  '<div style="display:flex;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap"><a class="btn btn-ghost btn-lg" href="#/contratar">Contratar serviço</a><a class="btn btn-lg" style="background:rgba(255,255,255,.16);color:#fff" href="#/entrar?tipo=profissional">Trabalhar na TaskGO</a></div></div>'+
  '</div></section>';
}

