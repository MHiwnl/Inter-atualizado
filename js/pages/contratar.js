/* =========================================================
   CONTRATAR (wizard)
   ========================================================= */
let W={step:1,service:'',urgency:'hoje',size:'medio',cameraCount:'1',radius:'10',addr:'',notes:'',date:'',pro:null,proQuote:null,est:null,pay:'pix',presetService:'',savedEstimateKeys:{}};
function pageContratar(){
  /* Contratar exige conta: sem login, vai para Entrar e volta para cá depois. */
  if(!me()){go('/entrar?next=app/contratar');return '';}
  if(route.q.servico&&W.step===1&&W.presetService!==route.q.servico){W.service=route.q.servico;W.presetService=route.q.servico;}
  if(route.q.raio)W.radius=route.q.raio;
  const names=['Serviço','Detalhes','Estimativa','Profissional','Confirmação'];
  const nav='<div class="wizard-nav">'+names.map((n,i)=>'<span class="wnav '+(W.step===i+1?'on':W.step>i+1?'ok':'')+'"><i>'+(W.step>i+1?ic('check'):i+1)+'</i>'+n+'</span>').join('')+'</div>';
  let body='';
  if(W.step===1)body=wStep1();
  else if(W.step===2)body=wStep2();
  else if(W.step===3)body=wStep3();
  else if(W.step===4)body=wStep4();
  else body=wStep5();
  if(route.page==='app')return dashHead('Contratar','A contratação ainda não está aberta: o pedido não pode ser enviado, porque o pagamento não está disponível.')+nav+'<div class="card">'+body+'</div>';
  return folha('contratar',duo('descreva o serviço','que você precisa',1)+'<p class="corpo">A contratação ainda não está aberta: o pedido não pode ser enviado, porque o pagamento não está disponível.</p>','cabeca')+
  '<section class="folha-densa" style="padding-top:0"><div class="wrap folha-in"><div class="folha-corpo">'+nav+'<div class="card">'+body+'</div></div></div></section>';
}
function wSet(k,v){
  W[k]=v;
  if(k==='service'){W.est=null;W.pro=null;W.proQuote=null;}
  if(k==='pro')W.proQuote=quoteForProfessional(proById(v),W.est||currentEstimate());
  render();
}
function currentEstimate(){return estimate(W.service,W.urgency,W.size,W.radius,W.cameraCount);}
function quoteForProfessional(pro,est){
  return null;
}
function wGo(n){
  if(n===2&&!W.service)return toast('Escolha um serviço para continuar','err');
  if(n===3){
    if(!W.addr)return toast('Informe o endereço do atendimento','err');
    W.est=currentEstimate();
    W.pro=null;W.proQuote=null;
    const cliente=me();
    const pedidoEstimativa={servico:W.service,distancia:''};
    const chaveEstimativa=JSON.stringify(pedidoEstimativa);
    W.savedEstimateKeys=W.savedEstimateKeys||{};
    const chavesEstimativas=W.savedEstimateKeys;
    if(cliente&&String(cliente.id).startsWith('db_')&&!chavesEstimativas[chaveEstimativa]){
      chavesEstimativas[chaveEstimativa]=true;
      fetch(API_BASE_URL+'/api/pedidos/estimar',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(pedidoEstimativa)
      })
        .then(response=>{
          if(!response.ok)throw new Error('Falha ao salvar estimativa: HTTP '+response.status);
          console.log('Pedido salvo no DB');
          return response.json();
        })
        .catch(error=>{
          delete chavesEstimativas[chaveEstimativa];
          console.error('Erro ao salvar pedido de estimativa:',error);
        });
    }
  }
  if(n===5&&!W.pro)return toast('Escolha um profissional','err');
  W.step=n;render();
}
function wStep1(){
  return '<h2 class="sub" style="margin-bottom:6px">Qual serviço você precisa?</h2><p class="muted" style="font-size:.9rem;margin-bottom:20px">Selecione a categoria mais próxima do seu problema.</p>'+
  '<div class="opt-grid">'+SERVICES.map(s=>'<button type="button" data-fk="opt-'+s.id+'" aria-pressed="'+(W.service===s.id)+'" class="opt '+(W.service===s.id?'sel':'')+'" onclick="wSet(\'service\',\''+s.id+'\')">'+ic(s.ico)+'<b>'+s.n+'</b>'+(DEMO_MODE?'<span>R$ '+s.min+'+</span>':'')+'</button>').join('')+'</div>'+
  '<div style="display:flex;justify-content:flex-end;margin-top:26px"><button class="btn btn-primary" onclick="wGo(2)">Continuar '+ic('arrow')+'</button></div>';
}
function wStep2(){
  /* Só o que o cliente sabe responder: onde, quando e o que está acontecendo. O tamanho do serviço o profissional avalia. */
  return '<h2 class="sub" style="margin-bottom:20px">Conte os detalhes</h2>'+
  campoEnderecoContratar()+
  '<div class="grid g2" style="gap:0 16px">'+
  '<div class="field"><label>Urgência</label><select class="select" onchange="wSet(\'urgency\',this.value)">'+
  [['agora','Agora (emergência)'],['hoje','Ainda hoje'],['agendar','Quero agendar']].map(o=>'<option value="'+o[0]+'" '+(W.urgency===o[0]?'selected':'')+'>'+o[1]+'</option>').join('')+'</select></div>'+
  (W.urgency==='agendar'?'<div class="field"><label>Data e hora desejadas</label><input class="input" type="datetime-local" onchange="W.date=this.value" value="'+esc(W.date)+'"></div>':'')+
  '</div>'+
  '<div class="field"><label>Descreva o problema (opcional)</label><textarea class="textarea" placeholder="Ex.: disjuntor desarmando toda vez que ligo o chuveiro" oninput="W.notes=this.value">'+esc(W.notes)+'</textarea>'+
  '<div class="hint">Conte o que acontece, onde e quantas peças ou cômodos. O profissional usa isso para entender o tamanho do serviço.</div></div>'+
  '<div style="display:flex;justify-content:space-between;margin-top:26px"><button class="btn btn-ghost" onclick="wGo(1)">'+ic('arrowLeft')+' Voltar</button>'+
  '<button class="btn btn-grad" onclick="wGo(3)">Ver referência de preço '+ic('arrow')+'</button></div>';
}
function wStep3(){
  const estimate=W.est||currentEstimate(),service=svc(W.service);
  const range='REFERÊNCIA POR '+service.unit.toUpperCase();
  return '<h2 class="sub" style="margin-bottom:6px">Faixa de referência do catálogo</h2>'+ 
  '<p class="muted" style="font-size:.9rem;margin-bottom:22px">Valores gerais da categoria. Não são preço calculado por IA nem proposta de profissional.</p>'+ 
  '<div class="card center" style="padding:30px"><span class="muted" style="font-size:.82rem;font-weight:700">'+range+'</span>'+ 
  '<div style="font-size:clamp(1.8rem,5vw,2.8rem);font-family:var(--font-mono);font-weight:600;margin:8px 0">'+(estimate.min==null?'Sem estimativa de preço cadastrada':money(estimate.min)+' – '+money(estimate.max))+'</div>'+ 
  '<span class="pill">'+ic('users')+' '+estimate.pros+' perfis cadastrados nesta categoria</span></div>'+ 
  '<div class="card" style="margin-top:18px">'+estimate.factors.map(item=>'<div style="display:flex;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid var(--line)"><span class="muted">'+item[0]+'</span><b>'+item[1]+'</b></div>').join('')+'</div>'+ 
  '<p class="hint" style="margin-top:14px">Distância, tempo de chegada e preço final dependem de dados ainda não fornecidos pelo sistema.</p>'+ 
  '<div style="display:flex;justify-content:space-between;margin-top:26px"><button class="btn btn-ghost" onclick="wGo(2)">'+ic('arrowLeft')+' Voltar</button><button class="btn btn-primary" onclick="wGo(4)">Ver profissionais '+ic('arrow')+'</button></div>';
}
function wStep4(){
  const list=S.pros.filter(p=>p.service===W.service).slice(0,6);
  return '<h2 class="sub" style="margin-bottom:6px">Escolha seu profissional</h2><p class="muted" style="font-size:.9rem;margin-bottom:20px">'+list.length+' perfis cadastrados nesta categoria. Distância e disponibilidade não estão cadastradas.</p>'+
  (list.length?list.map(p=>'<div onclick="wSet(\'pro\',\''+p.id+'\')">'+proRow(p,W.pro===p.id,quoteForProfessional(p,W.est||currentEstimate()))+'</div>').join(''):'<div class="card emptystate"><b>Nenhum profissional disponível</b><p style="margin-top:6px">Ainda não temos profissionais desta categoria na sua região.</p></div>')+
  '<div style="display:flex;justify-content:space-between;margin-top:22px"><button class="btn btn-ghost" onclick="wGo(3)">'+ic('arrowLeft')+' Voltar</button>'+
  '<button class="btn btn-primary" onclick="wGo(5)">Continuar '+ic('arrow')+'</button></div>';
}
function wStep5(){
  const p=proById(W.pro),s=svc(W.service),e=W.est||currentEstimate();
  const quote=W.proQuote==null?quoteForProfessional(p,e):W.proQuote;
  return '<h2 class="sub" style="margin-bottom:20px">Confirme seu pedido</h2>'+
  '<div class="card" style="margin-bottom:18px">'+
  [['Serviço',s.n],['Profissional',p.name],['Endereço',W.addr||'—'],
   ['Quando',W.urgency==='agora'?'Imediato':W.urgency==='hoje'?'Ainda hoje':(W.date?new Date(W.date).toLocaleString('pt-BR'):'A agendar')],
   ['Estimativa',e.min==null?'Não disponível':money(e.min)+' – '+money(e.max)],['Proposta do profissional',quote==null?'A combinar':'R$ '+quote]]
  .map(r=>'<div style="display:flex;justify-content:space-between;gap:20px;padding:11px 0;border-bottom:1px solid var(--line)"><span class="muted" style="font-size:.88rem">'+r[0]+'</span><b style="font-size:.88rem;text-align:right">'+esc(r[1])+'</b></div>').join('')+'</div>'+
  '<p class="aviso-linha" style="margin:20px 0 0">O pagamento pela plataforma ainda não existe, então este pedido não pode ser concluído. Nenhum valor será cobrado.</p>'+ 
  '<div style="display:flex;justify-content:space-between;margin-top:26px;gap:12px;flex-wrap:wrap"><button class="btn btn-ghost" onclick="wGo(4)">'+ic('arrowLeft')+' Voltar</button>'+ 
  '<button class="btn btn-grad btn-lg" onclick="abrirCheckout()">Ver situação do pagamento</button></div>';
}
/* Real checkout is unavailable until a payment provider is configured. */
function abrirCheckout(){
  if(!me()){toast('Faca login para continuar.','err');return go('/entrar?next=app/contratar');}
  openModal('<div class="modal-head"><div><h3>Pagamentos indisponiveis</h3><p>O checkout esta desativado.</p></div><button class="icon-btn" aria-label="Fechar" onclick="closeModal()">'+ic('x')+'</button></div><div class="card"><p class="muted">O TaskGO ainda nao esta conectado a um provedor. Nenhuma cobranca sera criada e nenhum pedido sera marcado como pago.</p></div>');
}
function trocarMetodoCheckout(){toast('Checkout indisponivel.','err');}
function copiarCodigoCheckout(){toast('Nao ha codigo PIX valido disponivel.','err');}
function confirmarPagamentoMock(evento){if(evento)evento.preventDefault();toast('Pagamento indisponivel. Nenhuma cobranca foi enviada.','err');}
function finalizarPedido(){toast('Pedido nao criado: falta confirmar o pagamento pelo provedor.','err');}
