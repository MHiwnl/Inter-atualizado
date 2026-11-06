/* Payments fail closed until a verified provider integration is configured. */
/* Purge unverified demo wallet values from browser state; these were never real funds. */
let paymentsDemoStateCleared=false;
for(const user of S.users){
  if(Number(user.balance)!==0||Number(user.pending)!==0||user.plan==='plus')paymentsDemoStateCleared=true;
  user.balance=0;user.pending=0;if(user.plan==='plus')user.plan='free';
}
if(S.tx.length){S.tx=[];paymentsDemoStateCleared=true;}
if(paymentsDemoStateCleared)Store.save();

function abrirCheckout(){
  if(!me()){toast('Faça login para continuar.','err');return go('/entrar?next=contratar');}
  openModal('<div class="modal-head"><div><h3>Pagamentos indisponíveis</h3><p>O checkout está desativado.</p></div><button class="icon-btn" aria-label="Fechar" onclick="closeModal()">'+ic('x')+'</button></div>'+ 
    '<div class="card"><p class="muted">O TaskGO ainda não está conectado a um provedor de pagamentos. Nenhuma cobrança será criada e nenhum pedido será marcado como pago.</p></div>');
}
function confirmarPagamentoMock(evento){if(evento)evento.preventDefault();toast('Pagamento indisponível. Nenhuma cobrança foi enviada.','err');}
function finalizarPedido(){toast('Pedido não criado: o pagamento ainda não pode ser processado.','err');}
function copiarCodigoCheckout(){toast('Não há código PIX válido disponível.','err');}
function simularPix(){toast('Recargas estão desativadas até a integração de pagamentos.','err');}
function abrirPix(){toast('PIX indisponível: provedor de pagamentos não configurado.','err');}
function abrirSaque(){toast('Saques estão desativados: não há saldo financeiro disponível.','err');}
function confirmarSaque(){toast('Saques estão desativados: não há saldo financeiro disponível.','err');}
function executarSaque(){toast('Saques estão desativados: não há saldo financeiro disponível.','err');}
function assinar(nome){if(nome==='Empresas')return go('/contato');toast('Assinaturas estão indisponíveis até a integração de pagamentos.','err');}
function confirmarPlano(){toast('Nenhuma assinatura foi ativada: pagamento indisponível.','err');}
function dashPlano(){
  return dashHead('Planos','Assinaturas e benefícios pagos ainda não estão habilitados.')+
    '<div class="card"><h3>TaskGO Plus indisponível</h3><p class="muted" style="margin-top:10px">Informações demonstrativas de planos não representam uma assinatura ativa. Nenhuma cobrança pode ser feita neste ambiente.</p></div>';
}

let financePageData=null,financePageLoading=false,financePageError='',financePageUserId=null;
async function carregarCarteiraFinanceira(){
  if(financePageLoading||DEMO_MODE)return;
  const usuario=me();if(!usuario||!String(usuario.id).startsWith('db_'))return;
  const requestedUserId=usuario.id;financePageUserId=requestedUserId;
  financePageLoading=true;financePageError='';
  try{
    const options={credentials:'include',headers:{Accept:'application/json'}};
    const [walletResponse,txResponse,withdrawalResponse]=await Promise.all([
      fetch(API_BASE_URL+'/api/financeiro/carteira',options),
      fetch(API_BASE_URL+'/api/financeiro/transacoes?page=0&size=20',options),
      fetch(API_BASE_URL+'/api/financeiro/saques',options)
    ]);
    if(!walletResponse.ok||!txResponse.ok||!withdrawalResponse.ok)throw new Error('Não foi possível consultar a carteira no servidor.');
    const data={wallet:await walletResponse.json(),transactions:await txResponse.json(),withdrawals:await withdrawalResponse.json()};
    if(me()?.id===requestedUserId)financePageData=data;
  }catch(error){financePageError=error.message||'Falha ao consultar os dados financeiros.';}
  finally{financePageLoading=false;if(route.page==='painel'&&route.sub==='carteira')render();}
}
function dashCarteira(){
  if(DEMO_MODE)return dashHead('Carteira demonstrativa','Os valores abaixo são fictícios e não representam dinheiro real.')+
    '<div class="card"><h3>Dados de demonstração</h3><p class="muted" style="margin-top:10px">Não é possível adicionar saldo, receber pagamentos ou sacar neste ambiente.</p></div>';
  if(financePageUserId!==me()?.id){financePageData=null;financePageError='';financePageUserId=me()?.id||null;}
  if(!financePageData&&!financePageLoading)carregarCarteiraFinanceira();
  const body=financePageLoading?'<div class="card" role="status">Consultando carteira no servidor…</div>':
    financePageError?'<div class="card"><h3>Carteira indisponível</h3><p class="muted" style="margin-top:10px">'+esc(financePageError)+'</p><button class="btn btn-ghost" onclick="financePageData=null;financePageError=\'\';carregarCarteiraFinanceira()">Tentar novamente</button></div>':
    !financePageData?'<div class="card">Entre novamente com uma conta persistida para consultar a carteira.</div>':
    '<div class="grid g3" style="margin-bottom:18px">'+[['Disponível',financePageData.wallet.disponivel],['Pendente',financePageData.wallet.pendente],['Bloqueado',financePageData.wallet.bloqueado]].map(item=>'<div class="card"><span class="muted">'+item[0]+'</span><h3 style="margin-top:8px">'+money(item[1])+'</h3></div>').join('')+'</div>'+ 
    '<div class="card" style="margin-bottom:18px"><h3>Movimentações financeiras</h3><p class="muted" style="margin-top:8px">Créditos só aparecem após confirmação verificável do provedor. Saques solicitados ficam pendentes até processamento operacional.</p></div>'+ 
    '<div class="card"><h3>Extrato</h3>'+(financePageData.transactions.content?.length?financePageData.transactions.content.map(tx=>'<div style="display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)"><span>'+esc(tx.tipo)+' · '+esc(tx.status)+'</span><b>'+money(tx.valor)+'</b></div>').join(''):'<p class="muted" style="margin-top:10px">Nenhuma movimentação registrada no servidor.</p>')+'</div>'+ 
    (financePageData.withdrawals.length?'<div class="card" style="margin-top:18px"><h3>Solicitações de saque</h3>'+financePageData.withdrawals.map(item=>'<p class="muted" style="margin-top:8px">'+money(item.valor)+' · '+esc(item.status)+' · '+new Date(item.criadaEm).toLocaleString('pt-BR')+'</p>').join('')+'</div>':'');
  return dashHead('Carteira','Saldo e extrato consultados no servidor. Movimentações dependem de confirmação e processamento.')+body;
}

function dashIndicacoes(){
  return dashHead('Indicações','Créditos por indicação ainda não são contabilizados no servidor.')+
    '<div class="card"><p class="muted">Códigos, descontos e recompensas demonstrativos não são válidos para contas reais.</p></div>';
}

async function concluirServico(id){
  const pedido=S.orders.find(o=>o.id===id),usuario=me();
  if(!pedido||!usuario)return toast('Pedido não encontrado.','err');
  const profissional=usuario.role==='profissional'&&pedido.proId===usuario.proId;
  const cliente=usuario.role==='cliente'&&(pedido.clientId===usuario.id||String(pedido.clientEmail||'').toLowerCase()===String(usuario.email||'').toLowerCase());
  if(!profissional&&!cliente)return toast('Este pedido não pertence à sua conta.','err');
  if(pedido.status!=='em_andamento')return toast('O serviço não está em andamento.','err');
  try{await guardarPedidoAlterado(pedido,{status:'concluido'});toast('Serviço concluído. Pagamento continua indisponível.','ok');abrirAvaliacao(id);}
  catch(error){toast(error.message||'O servidor não confirmou a conclusão do serviço.','err');}
}
