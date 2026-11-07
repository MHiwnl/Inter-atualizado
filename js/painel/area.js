/* =========================================================
   ÁREA DE USO (#/app)
   Onde a pessoa usa a TaskGO depois do login. O site só apresenta;
   o painel (#/painel) cuida só do perfil.
   ========================================================= */
const ABAS_CLIENTE=[['contratar','Contratar','plus'],['pedidos','Meus pedidos','list'],['mensagens','Mensagens','chat'],['avaliacoes','Avaliações','star'],['notificacoes','Notificações','bell'],['carteira','Carteira','wallet']];
const ABAS_PROFISSIONAL=[['oportunidades','Oportunidades','target'],['pedidos','Atendimentos','list'],['agenda','Agenda','cal'],['desempenho','Desempenho','trendUp'],['mensagens','Mensagens','chat'],['avaliacoes','Avaliações','star'],['notificacoes','Notificações','bell'],['carteira','Carteira','wallet']];
function abasDaConta(u){return u.role==='profissional'?ABAS_PROFISSIONAL:ABAS_CLIENTE;}
function abaInicial(u){return abasDaConta(u)[0][0];}
/* Cabeçalho próprio: logo leva ao site, as abas à área e o menu da conta ao perfil. */
function cabecalhoArea(u,abas){
  const unread=myNotifs().filter(n=>!n.read).length;
  const atual=route.sub==='pedido'?'pedidos':route.sub;
  return '<header class="area-topo"><div class="wrap area-topo-in">'+
    '<a href="#/home" class="logo" aria-label="TaskGO: ir para o site"><span class="lt">Task<b>GO</b></span></a>'+
    '<span class="area-rotulo">Minha área</span>'+
    '<div class="area-acoes">'+themeBtn()+menuConta(u)+'</div></div>'+
    (abas?'<nav class="wrap area-abas" aria-label="Seções da área">'+abas.map(a=>'<a href="#/app/'+a[0]+'" class="'+(atual===a[0]?'active':'')+'"'+(atual===a[0]?' aria-current="page"':'')+'>'+ic(a[2])+'<span>'+a[1]+'</span>'+(a[0]==='notificacoes'&&unread?'<span class="badge" aria-label="'+unread+' não lidas">'+unread+'</span>':'')+'</a>').join('')+'</nav>':'')+
  '</header>';
}
function pageApp(){
  const u=me();
  if(!u){go('/entrar?next=app');return '';}
  const abas=abasDaConta(u);
  let sub=route.sub;
  if(!sub||(sub==='contratar'&&u.role==='profissional')||(sub==='oportunidades'&&u.role!=='profissional')){
    sub=abaInicial(u);history.replaceState(null,'','#/app/'+sub);route.sub=sub;
  }
  let content='';
  if(sub==='pedido')content=dashPedido(route.id);
  else if(sub==='contratar')content=pageContratar();
  else if(sub==='pedidos')content=dashPedidos();
  else if(sub==='carteira')content=carteiraArea();
  else if(sub==='mensagens')content=dashMensagens();
  else if(sub==='avaliacoes')content=dashAvaliacoes();
  else if(sub==='notificacoes')content=dashNotificacoes();
  else if(sub==='agenda')content=dashAgenda();
  else if(sub==='desempenho')content=dashDesempenho();
  else if(sub==='oportunidades')content=dashOportunidades();
  else if(sub==='plano')content=dashPlano();
  else if(sub==='indicacoes')content=dashIndicacoes();
  else{history.replaceState(null,'','#/app/'+abaInicial(u));route.sub=abaInicial(u);return pageApp();}
  return '<div class="area">'+cabecalhoArea(u,abas)+'<main class="wrap area-main" id="conteudo" tabindex="-1">'+content+'</main></div>';
}
/* Painel: só o perfil. O botão de voltar leva para a área de uso. */
function pageDash(){
  const u=me();
  if(!u){go('/entrar');return '';}
  return '<div class="area">'+cabecalhoArea(u,null)+
    '<main class="wrap area-main" id="conteudo" tabindex="-1"><div class="dash-tools"><a class="btn btn-ghost btn-sm voltar-site" href="#/app">'+ic('arrowLeft')+'Voltar para minha área</a></div>'+dashConfig()+'</main></div>';
}

/* ---------- Carteira: saldo, resgate e formas de pagamento e de resgate ---------- */
/* Nada aqui é salvo nem cobrado: a plataforma ainda não processa pagamentos. */
let formaPagamento='pix',formaResgate='pix';
function opcaoForma(grupo,valor,atual,rotulo,descricao,icone){
  return '<label class="forma'+(valor===atual?' sel':'')+'"><input type="radio" name="'+grupo+'" value="'+valor+'"'+(valor===atual?' checked':'')+' onchange="'+(grupo==='pag'?'formaPagamento':'formaResgate')+'=this.value;render()">'+
    ic(icone)+'<span><b>'+rotulo+'</b><small>'+descricao+'</small></span></label>';
}
function campoDesativado(id,rotulo,html){return '<div class="field"><label for="'+id+'">'+rotulo+'</label>'+html.replace('>',' id="'+id+'" disabled>')+'</div>';}
function carteiraArea(){
  const u=me(),isPro=u.role==='profissional';
  const aviso='<p class="aviso-linha" role="note"><b>Ainda não disponível.</b> A plataforma não processa pagamentos. Você pode ver como vai funcionar, mas nenhum dado é salvo e nada é cobrado ou transferido.</p>';
  const saldo=financePageData?.wallet?.disponivel;
  const resgatar=isPro?
    '<section class="carteira-bloco"><h2 class="sub">Resgatar dinheiro</h2>'+
    '<p class="t2" style="margin:6px 0 14px">Saldo disponível para resgate: <b>'+(saldo==null?'—':money(saldo))+'</b>.</p>'+
    '<button type="button" class="btn btn-primary" disabled>'+ic('down')+'Resgatar</button>'+
    '<p class="hint" style="margin-top:8px">'+(Number(saldo)>0?'O resgate será enviado para a forma escolhida abaixo.':'Não há saldo para resgatar: a plataforma ainda não recebe pagamentos.')+'</p></section>':'';
  const pagamento=!isPro?
    '<section class="carteira-bloco"><h2 class="sub">Forma de pagamento</h2><p class="t2" style="margin:6px 0 14px">Como você vai pagar os serviços contratados.</p>'+
    '<div class="formas" role="radiogroup" aria-label="Forma de pagamento">'+
      opcaoForma('pag','pix',formaPagamento,'PIX','Pagamento na hora, pelo app do banco','pix')+
      opcaoForma('pag','cartao',formaPagamento,'Cartão de crédito','Crédito, à vista','wallet')+
      opcaoForma('pag','boleto',formaPagamento,'Boleto','Compensa em até 2 dias úteis','file')+
    '</div>'+
    (formaPagamento==='cartao'?'<div class="forma-campos">'+campoDesativado('cartaoNumero','Número do cartão','<input class="input" placeholder="0000 0000 0000 0000">')+'<div class="grid g2" style="gap:0 16px">'+campoDesativado('cartaoValidade','Validade','<input class="input" placeholder="MM/AA">')+campoDesativado('cartaoNome','Nome no cartão','<input class="input" placeholder="Como está no cartão">')+'</div></div>':
     formaPagamento==='pix'?'<p class="hint forma-campos">No pagamento, você vai receber um código PIX para copiar ou escanear.</p>':'<p class="hint forma-campos">No pagamento, você vai receber o boleto para pagar no banco ou no app.</p>')+
    '<button type="button" class="btn btn-primary" disabled>Salvar forma de pagamento</button></section>':'';
  const bancos=['Banco do Brasil','Caixa Econômica','Bradesco','Itaú','Santander','Nubank','Inter','C6 Bank','Mercado Pago','PagBank'];
  const resgate=isPro?
    '<section class="carteira-bloco"><h2 class="sub">Forma de resgate</h2><p class="t2" style="margin:6px 0 14px">Para onde vai o dinheiro dos seus atendimentos.</p>'+
    '<div class="formas" role="radiogroup" aria-label="Forma de resgate">'+
      opcaoForma('res','pix',formaResgate,'PIX','Cai na hora, na chave que você escolher','pix')+
      opcaoForma('res','banco',formaResgate,'Conta bancária','Transferência para banco, agência e conta','building')+
    '</div><div class="forma-campos">'+
    (formaResgate==='pix'?
      '<div class="grid g2" style="gap:0 16px">'+campoDesativado('pixTipo','Tipo de chave','<select class="select"><option>CPF</option><option>E-mail</option><option>Telefone</option><option>Chave aleatória</option></select>')+campoDesativado('pixChave','Chave PIX','<input class="input" placeholder="Sua chave">')+'</div>':
      campoDesativado('bancoNome','Banco','<select class="select">'+bancos.map(b=>'<option>'+b+'</option>').join('')+'</select>')+
      '<div class="grid g2" style="gap:0 16px">'+campoDesativado('bancoAgencia','Agência','<input class="input" placeholder="0000">')+campoDesativado('bancoConta','Conta com dígito','<input class="input" placeholder="00000-0">')+'</div>'+
      campoDesativado('bancoTipo','Tipo de conta','<select class="select"><option>Corrente</option><option>Poupança</option></select>'))+
    '</div><button type="button" class="btn btn-primary" disabled>Salvar forma de resgate</button></section>':'';
  return dashCarteira()+'<div class="carteira-extra">'+aviso+resgatar+resgate+pagamento+'</div>';
}
