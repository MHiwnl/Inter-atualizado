/* ---------- COMO FUNCIONA ---------- */
function pageComo(){
  const blocos=[
    ['Para quem trabalha',[
      ['file','1. Crie sua conta','Cadastre-se com nome, CPF e telefone. A verificação de documentos ainda não está disponível.','ok'],
      ['target','2. Escolha sua categoria','Informe sua categoria principal no cadastro. Raio de atendimento e preços ainda não podem ser definidos.','parcial'],
      ['bell','3. Receba pedidos','Os pedidos da sua categoria aparecerão no painel, com aviso dentro do app. Ainda não há pedidos de clientes.','parcial'],
      ['route','4. Vá até o cliente','Com sua permissão, compartilhe a localização enquanto estiver a caminho. Funciona dentro de um pedido aceito.','parcial'],
      ['checkCircle','5. Conclua o serviço','Finalize o atendimento no app e receba a avaliação do cliente.','parcial'],
      ['wallet','6. Receba pelo serviço','Recebimento e saque pela plataforma ainda não estão disponíveis.','plan']
    ]],
    ['Para quem contrata',[
      ['search','1. Descreva o que precisa','Escolha a categoria e descreva o serviço. O pedido ainda não pode ser enviado, porque depende do pagamento, que não está disponível.','parcial'],
      ['sparkle','2. Veja uma referência de preço','O site mostra uma faixa de preço para a categoria. É só uma referência: não usa IA e não é um valor confirmado por um profissional.','parcial'],
      ['users','3. Compare e escolha','Veja nota, avaliações e distância para escolher quem atende. Ainda não há profissionais cadastrados.','plan'],
      ['nav','4. Acompanhe a chegada','Veja a última posição compartilhada pelo profissional. Funciona dentro de um pedido aceito; o app não calcula rota nem horário de chegada.','parcial'],
      ['key','5. Confirme o código','Na chegada, confirme o código de 4 dígitos para iniciar o serviço. Funciona dentro de um pedido aceito.','parcial'],
      ['pix','6. Pagamento','O pagamento pela plataforma ainda não existe, e a forma de pagar está em definição.','plan']
    ]]
  ];
  return '<section class="section"><div class="wrap">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('route')+' Passo a passo</span><h1 class="lp-page-title">Como funciona a TaskGO</h1>'+
  '<p>Transparência do início ao fim, para quem trabalha e para quem contrata.</p>'+
  '<p class="lp-legend">Cada etapa mostra se já funciona, se funciona em parte ou se ainda está planejada.</p></div>'+
  blocos.map(b=>'<h2 class="lp-subhead">'+b[0]+'</h2><div class="grid g3">'+
    b[1].map(x=>'<div class="card card-hover lp-feature"><div class="lp-feature-top"><div class="ico-box">'+ic(x[0])+'</div>'+statusTag(x[3])+'</div><h3>'+x[1]+'</h3><p>'+x[2]+'</p></div>').join('')+'</div>').join('')+
  '<div class="ribbon lp-ribbon-gap"><h2>Quer acompanhar de perto?</h2><p>A TaskGO ainda não está aberta para contratação. Conheça o projeto ou participe da validação.</p>'+
  '<div class="lp-actions"><a class="btn btn-ghost btn-lg" href="#/sobre">Conhecer o projeto</a><a class="btn btn-lg lp-btn-line" href="#/contato">Participar da validação</a></div></div>'+
  '</div></section>';
}
