/* =========================================================
   INÍCIO
   ========================================================= */
/* Foto principal do topo. Sem caminho, o topo mostra o desenho do raio de atendimento.
   Origem: imagem gerada no ChatGPT (gpt-image), conforme as credenciais C2PA do original em assets/photos/principal.jpg.
   O arquivo do site é uma versão reduzida do original. */
const FOTO_PRINCIPAL='assets/photos/site/principal.jpg';
const FOTO_PRINCIPAL_ALT='Alicate de eletricista com marcas de uso, apoiado sobre cimento.';
function desenhoRaio(){
  return '<svg class="hero-desenho" viewBox="0 0 600 600" aria-hidden="true" focusable="false">'+
    [70,140,210,280].map((r,i)=>'<circle cx="300" cy="300" r="'+r+'"'+(i<3?' class="fino"':'')+'/>').join('')+
    '<line class="fino" x1="300" y1="0" x2="300" y2="600"/><line class="fino" x1="0" y1="300" x2="600" y2="300"/>'+
    '<path class="rota" d="M64 452H176V360H300V300"/>'+
    '<circle class="ponto" cx="300" cy="300" r="7"/><circle class="ponto" cx="64" cy="452" r="7"/>'+
  '</svg>';
}
function heroCampo(){
  const foto=FOTO_PRINCIPAL?'<img class="hero-foto" src="'+FOTO_PRINCIPAL+'" alt="'+esc(FOTO_PRINCIPAL_ALT)+'">':desenhoRaio();
  return '<div class="hero-campo">'+foto+'</div>';
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
  return FLUXO_ETAPAS.map((e,i)=>'<li class="ticket-linha'+(i<=fluxoEtapa?' feita':'')+'"><span class="ticket-chave">'+e[0]+'</span><span>'+(i<=fluxoEtapa?e[2]:e[1])+'</span></li>').join('');
}
function fluxoRotulo(){return fluxoEtapa<FLUXO_ETAPAS.length-1?FLUXO_ETAPAS[fluxoEtapa+1][3]:'Ver de novo';}
function fluxoProfissional(){
  return '<div class="ticket"><div class="ticket-topo"><b>Pedido de exemplo</b>'+statusTag('plan','Protótipo')+'</div>'+
  '<ol class="ticket-linhas" id="fluxoLinhas">'+fluxoLinhas()+'</ol>'+
  '<button type="button" class="btn btn-primary btn-block" id="fluxoBtn" onclick="avancarFluxo()">'+fluxoRotulo()+'</button>'+
  '<p class="ticket-nota">Dados fictícios: mostra como o fluxo foi pensado.</p>'+
  '<p class="leitor" role="status" id="fluxoAviso"></p></div>';
}
function avancarFluxo(){
  fluxoEtapa=fluxoEtapa<FLUXO_ETAPAS.length-1?fluxoEtapa+1:0;
  $('#fluxoLinhas').innerHTML=fluxoLinhas();
  $('#fluxoBtn').textContent=fluxoRotulo();
  const e=FLUXO_ETAPAS[fluxoEtapa];
  $('#fluxoAviso').textContent=e[0]+': '+e[2];
}
function pageHome(){
  return '<section class="hero">'+heroCampo()+'<div class="wrap"><div class="hero-texto">'+
    duo('você escolhe o pedido.','o endereço só aparece depois do aceite.',1)+
    '<p class="hero-sub">A TaskGO aproxima profissionais autônomos de quem precisa de serviços locais. O projeto está em desenvolvimento, e queremos ouvir quem vai usá-lo antes do lançamento.</p>'+
    '<div class="setas">'+linkSeta('#/profissionais','Sou profissional',1)+linkSeta('#/servicos','Preciso de um serviço')+'</div>'+
    '<p class="hero-fase">Em desenvolvimento · Recife</p>'+
  '</div></div></section>'+

  folha('o problema','<p class="manifesto">Hoje, indicação, conversa, combinação de preço e acompanhamento ficam espalhados entre canais diferentes. <strong>A TaskGO reúne tudo em um só fluxo.</strong></p>','folha-densa')+

  folha('para profissionais','<div class="fluxo"><div>'+
    duo('veja um pedido','do começo ao fim',2,'duo-az')+
    '<p class="corpo">A TaskGO está sendo feita primeiro para profissionais autônomos. Hoje nenhum pedido pode ser enviado. Crie sua conta para conhecer o painel e ajudar a definir como isto vai funcionar.</p>'+
    '<div class="setas">'+linkSeta('#/entrar?tipo=profissional','Criar conta de profissional',1)+'</div></div>'+
    fluxoProfissional()+'</div>')+

  folha('categorias',duo('serviços que queremos','reunir na TaskGO')+
    '<p class="corpo">A presença no catálogo não significa que já existam profissionais cadastrados ou disponíveis.</p>'+
    '<div class="cats">'+SERVICES.map(s=>'<a href="#/servicos/'+s.id+'">'+ic(s.ico)+'<span>'+s.n+'</span>'+ic('arrow')+'</a>').join('')+'</div>')+

  folha('estado atual','<h2 class="zero"><em>0 clientes.</em>0 profissionais.</h2>'+
    '<p class="corpo" style="margin-top:28px">A TaskGO ainda não está aberta para contratação. Estamos desenvolvendo e validando a plataforma antes do lançamento.</p>'+
    '<ul class="negativas"><li>Contratação e pagamentos não estão disponíveis.</li><li>Verificação de identidade e garantias ainda não foram implementadas.</li></ul>'+
    '<div class="setas">'+linkSeta('#/sobre','Conheça o projeto')+'</div>','azul')+

  folha('desafio e proposta',duo('o que queremos','melhorar com a TaskGO')+
    '<div class="duelo">'+[
      ['Encontrar um profissional','Buscar por indicação pode deixar informações e opções espalhadas.','Reunir busca por categoria e região, com informações para ajudar na escolha.'],
      ['Ter uma referência de preço','Sem uma referência inicial, fica mais difícil planejar o serviço.','Apresentar uma estimativa antes do pedido e permitir combinar o valor com clareza.'],
      ['Acompanhar o atendimento','Pedido, conversa e pagamento podem acabar em canais diferentes.','Organizar as etapas e a comunicação do serviço em um só fluxo.']
    ].map(t=>'<div class="duelo-linha"><h3>'+t[0]+'</h3><div><small>Desafio</small><p>'+t[1]+'</p></div><div><small>Proposta TaskGO</small><p>'+t[2]+'</p></div></div>').join('')+'</div>')+

  folha('dúvidas',duo('perguntas','frequentes')+
    '<div class="faq-lista" style="margin-top:36px">'+faqList([7,6,2,0,1,5].map(i=>FAQ[i]))+'</div>'+
    '<div class="setas">'+linkSeta('#/ajuda','Ver todas as perguntas')+'</div>')+

  '<section class="folha fecho"><div class="wrap fecho-in"><div>'+duo('conte como','você trabalha')+
    '<p class="corpo">Prefere falar antes de criar a conta? Sua mensagem fica registrada para a equipe.</p></div>'+
    formContato()+'</div></section>';
}
