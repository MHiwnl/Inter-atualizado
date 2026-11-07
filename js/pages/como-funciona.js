/* ---------- COMO FUNCIONA ---------- */
function pageComo(){
  const blocos=[
    ['para quem trabalha',[
      ['Crie sua conta','Cadastre-se com nome, CPF e telefone. A verificação de documentos ainda não está disponível.','ok'],
      ['Escolha sua categoria','Informe sua categoria principal no cadastro. Raio de atendimento e preços ainda não podem ser definidos.','parcial'],
      ['Receba pedidos','Os pedidos da sua categoria vão aparecer no painel, com aviso dentro do app.','espera'],
      ['Vá até o cliente','Com sua permissão, você vai compartilhar a localização enquanto estiver a caminho.','espera'],
      ['Conclua o serviço','Você vai finalizar o atendimento no app e receber a avaliação do cliente.','espera'],
      ['Receba pelo serviço','Recebimento e saque pela plataforma ainda não estão disponíveis.','plan']
    ]],
    ['para quem contrata',[
      ['Descreva o que precisa','Escolha a categoria e descreva o serviço. O pedido ainda não pode ser enviado, porque depende do pagamento, que não está disponível.','parcial'],
      ['Veja uma referência de preço','O site mostra uma faixa de preço para a categoria. É só uma referência: não usa IA e não é um valor confirmado por um profissional.','parcial'],
      ['Compare e escolha','Veja nota, avaliações e distância para escolher quem atende. Ainda não há profissionais cadastrados.','plan'],
      ['Acompanhe a chegada','Você vai ver a última posição compartilhada pelo profissional. O app não calcula rota nem horário de chegada.','espera'],
      ['Confirme o código','Na chegada, você vai confirmar o código de 4 dígitos para iniciar o serviço.','espera'],
      ['Pagamento','O pagamento pela plataforma ainda não existe, e a forma de pagar está em definição.','plan']
    ]]
  ];
  return folha('passo a passo',duo('como funciona','a TaskGO',1)+
    '<p class="aviso-linha" style="margin-top:24px"><b>Hoje nenhum cliente consegue enviar um pedido, porque o pagamento ainda não existe. Criar conta agora serve para conhecer o painel, não para receber trabalho.</b></p>'+
    '<p class="corpo">Cada etapa mostra o estado real: funciona, funciona em parte, aguarda pedidos (está pronta, mas só acontece quando houver um pedido) ou está planejada.</p>','cabeca')+
  folha('etapas','<div class="etapas-grupos">'+blocos.map(b=>'<div><h2 class="grupo-titulo">'+b[0]+'</h2><ol class="etapas">'+
    b[1].map(x=>'<li><div><h3>'+x[0]+'</h3>'+statusTag(x[2])+'<p>'+x[1]+'</p></div></li>').join('')+'</ol></div>').join('')+'</div>','folha-densa')+
  folha('próximo passo',duo('quer acompanhar','de perto?')+
    '<p class="corpo">A TaskGO ainda não está aberta para contratação. Crie sua conta para conhecer o painel ou fale com a equipe.</p>'+
    '<div class="setas">'+linkSeta('#/entrar?tipo=profissional','Criar conta de profissional',1)+linkSeta('#/contato','Falar com a equipe')+'</div>');
}
