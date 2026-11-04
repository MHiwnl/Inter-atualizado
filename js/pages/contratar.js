/* =========================================================
   CONTRATAR (wizard)
   ========================================================= */
let W={step:1,service:'',urgency:'hoje',size:'medio',cameraCount:'1',radius:'10',addr:'',notes:'',date:'',pro:null,proQuote:null,est:null,pay:'pix',presetService:'',savedEstimateKeys:{}};
function pageContratar(){
  if(route.q.servico&&W.step===1&&W.presetService!==route.q.servico){W.service=route.q.servico;W.presetService=route.q.servico;}
  if(route.q.raio)W.radius=route.q.raio;
  const names=['Serviço','Detalhes','Estimativa','Profissional','Confirmação'];
  const nav='<div class="wizard-nav">'+names.map((n,i)=>'<span class="wnav '+(W.step===i+1?'on':W.step>i+1?'ok':'')+'"><i>'+(W.step>i+1?'✓':i+1)+'</i>'+n+'</span>').join('')+'</div>';
  let body='';
  if(W.step===1)body=wStep1();
  else if(W.step===2)body=wStep2();
  else if(W.step===3)body=wStep3();
  else if(W.step===4)body=wStep4();
  else body=wStep5();
  return '<section class="section"><div class="wrap" style="max-width:920px">'+
  '<div class="sec-head" style="margin-bottom:26px"><span class="eyebrow">'+ic('sparkle')+' Contratar</span><h2>Peça seu serviço em minutos</h2></div>'+
  nav+'<div class="card" style="padding:28px">'+body+'</div></div></section>';
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
  return '<h3 style="margin-bottom:6px">Qual serviço você precisa?</h3><p class="muted" style="font-size:.9rem;margin-bottom:20px">Selecione a categoria mais próxima do seu problema.</p>'+
  '<div class="opt-grid">'+SERVICES.map(s=>'<div class="opt '+(W.service===s.id?'sel':'')+'" onclick="wSet(\'service\',\''+s.id+'\')">'+ic(s.ico)+'<b>'+s.n+'</b>'+(DEMO_MODE?'<span>R$ '+s.min+'+</span>':'')+'</div>').join('')+'</div>'+
  '<div style="display:flex;justify-content:flex-end;margin-top:26px"><button class="btn btn-primary" onclick="wGo(2)">Continuar '+ic('arrow')+'</button></div>';
}
function wStep2(){
  const u=me();
  const scopeField=W.service==='cftv'
    ?'<div class="field"><label>Quantidade de câmeras</label><select class="select" onchange="wSet(\'cameraCount\',this.value)">'+[1,2,4,6,8,12,16].map(n=>'<option value="'+n+'" '+(Number(W.cameraCount)===n?'selected':'')+'>'+n+(n===1?' câmera':' câmeras')+'</option>').join('')+'</select><div class="hint">A estimativa considera a instalação. Equipamentos são cobrados à parte.</div></div>'
    :'<div class="field"><label>Porte do serviço</label><select class="select" onchange="W.size=this.value">'+[['pequeno','Pequeno (até 1h)'],['medio','Médio (2 a 4h)'],['grande','Grande (dia inteiro ou mais)']].map(o=>'<option value="'+o[0]+'" '+(W.size===o[0]?'selected':'')+'>'+o[1]+'</option>').join('')+'</select></div>';
  return '<h3 style="margin-bottom:20px">Conte os detalhes</h3>'+
  '<div class="field"><label>Endereço do atendimento</label><input class="input" id="wAddr" placeholder="Rua, número, bairro, cidade" value="'+esc(W.addr||(u?u.address:''))+'" oninput="W.addr=this.value"></div>'+
  '<div class="grid g2" style="gap:16px">'+
  scopeField+
  '<div class="field"><label>Urgência</label><select class="select" onchange="wSet(\'urgency\',this.value)">'+
  [['agora','Agora (emergência)'],['hoje','Ainda hoje'],['agendar','Quero agendar']].map(o=>'<option value="'+o[0]+'" '+(W.urgency===o[0]?'selected':'')+'>'+o[1]+'</option>').join('')+'</select></div></div>'+
  (W.urgency==='agendar'?'<div class="field"><label>Data e hora desejadas</label><input class="input" type="datetime-local" onchange="W.date=this.value" value="'+esc(W.date)+'"></div>':'')+
  '<div class="field"><label>Raio de busca</label><select class="select" onchange="W.radius=this.value">'+
  ['5','10','20','40'].map(r=>'<option value="'+r+'" '+(W.radius===r?'selected':'')+'>Até '+r+' km</option>').join('')+'</select></div>'+
  '<div class="field"><label>Descreva o problema (opcional)</label><textarea class="textarea" placeholder="Ex.: disjuntor desarmando toda vez que ligo o chuveiro" oninput="W.notes=this.value">'+esc(W.notes)+'</textarea></div>'+
  '<div class="field"><label>Fotos do local (opcional)</label><input class="input" type="file" accept="image/*" multiple><div class="hint">Fotos ajudam o profissional a levar as ferramentas certas.</div></div>'+
  '<div style="display:flex;justify-content:space-between;margin-top:26px"><button class="btn btn-ghost" onclick="wGo(1)">'+ic('arrowLeft')+' Voltar</button>'+
  '<button class="btn btn-grad" onclick="wGo(3)">'+ic('sparkle')+' Gerar estimativa com IA</button></div>';
}
function wStep3(){
  const estimate=W.est||currentEstimate(),service=svc(W.service);
  const range=service.id==='cftv'?'TOTAL INDICATIVO PARA '+estimate.quantity+' CÂMERAS':'REFERÊNCIA POR '+service.unit.toUpperCase();
  return '<div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">'+ic('sparkle')+'<h3>Faixa de referência do catálogo</h3></div>'+ 
  '<p class="muted" style="font-size:.9rem;margin-bottom:22px">Valores gerais da categoria. Não são preço calculado por IA nem proposta de profissional.</p>'+ 
  '<div class="card center" style="padding:30px"><span class="muted" style="font-size:.82rem;font-weight:700">'+range+'</span>'+ 
  '<div style="font-size:clamp(1.8rem,5vw,2.8rem);font-weight:800;margin:8px 0">'+(estimate.min==null?'Sem estimativa de preço cadastrada':money(estimate.min)+' – '+money(estimate.max))+'</div>'+ 
  '<span class="pill pill-brand">'+ic('users')+' '+estimate.pros+' perfis cadastrados nesta categoria</span></div>'+ 
  '<div class="card" style="margin-top:18px">'+estimate.factors.map(item=>'<div style="display:flex;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid var(--line)"><span class="muted">'+item[0]+'</span><b>'+item[1]+'</b></div>').join('')+'</div>'+ 
  '<p class="hint" style="margin-top:14px">Distância, tempo de chegada e preço final dependem de dados ainda não fornecidos pelo sistema.</p>'+ 
  '<div style="display:flex;justify-content:space-between;margin-top:26px"><button class="btn btn-ghost" onclick="wGo(2)">'+ic('arrowLeft')+' Voltar</button><button class="btn btn-primary" onclick="wGo(4)">Ver profissionais '+ic('arrow')+'</button></div>';
}
function wStep4(){
  const list=S.pros.filter(p=>p.service===W.service).slice(0,6);
  return '<h3 style="margin-bottom:6px">Escolha seu profissional</h3><p class="muted" style="font-size:.9rem;margin-bottom:20px">'+list.length+' perfis cadastrados nesta categoria. Distância e disponibilidade não estão cadastradas.</p>'+
  (list.length?list.map(p=>'<div onclick="wSet(\'pro\',\''+p.id+'\')">'+proRow(p,W.pro===p.id,quoteForProfessional(p,W.est||currentEstimate()))+'</div>').join(''):'<div class="card emptystate"><b>Nenhum profissional disponível</b><p style="margin-top:6px">Ainda não temos profissionais desta categoria na sua região.</p></div>')+
  '<div style="display:flex;justify-content:space-between;margin-top:22px"><button class="btn btn-ghost" onclick="wGo(3)">'+ic('arrowLeft')+' Voltar</button>'+
  '<button class="btn btn-primary" onclick="wGo(5)">Continuar '+ic('arrow')+'</button></div>';
}
function wStep5(){
  const p=proById(W.pro),s=svc(W.service),e=W.est||currentEstimate();
  const quote=W.proQuote==null?quoteForProfessional(p,e):W.proQuote;
  return '<h3 style="margin-bottom:20px">Confirme seu pedido</h3>'+
  '<div class="card" style="background:var(--surface-2);margin-bottom:18px">'+
  [['Serviço',s.n],['Profissional',p.name],['Endereço',W.addr||'—'],
   ['Quando',W.urgency==='agora'?'Imediato':W.urgency==='hoje'?'Ainda hoje':(W.date?new Date(W.date).toLocaleString('pt-BR'):'A agendar')],
   ['Estimativa',e.min==null?'Não disponível':money(e.min)+' – '+money(e.max)],['Proposta do profissional',quote==null?'A combinar':'R$ '+quote]]
  .map(r=>'<div style="display:flex;justify-content:space-between;gap:20px;padding:11px 0;border-bottom:1px solid var(--line)"><span class="muted" style="font-size:.88rem">'+r[0]+'</span><b style="font-size:.88rem;text-align:right">'+esc(r[1])+'</b></div>').join('')+'</div>'+
  '<div style="margin-top:20px;padding:14px;border-radius:14px;background:color-mix(in srgb,var(--brand) 10%,transparent);border:1px solid color-mix(in srgb,var(--brand) 26%,transparent);font-size:.86rem;display:flex;gap:10px">'+ic('shield')+
  '<span>Escolha PIX, cartão ou saldo no checkout. Esta é uma simulação para o MVP; nenhum valor será cobrado.</span></div>'+ 
  '<div style="display:flex;justify-content:space-between;margin-top:26px;gap:12px;flex-wrap:wrap"><button class="btn btn-ghost" onclick="wGo(4)">'+ic('arrowLeft')+' Voltar</button>'+ 
  '<button class="btn btn-grad btn-lg" onclick="abrirCheckout()">'+ic('check')+' Ir para pagamento</button></div>';
}
/* Real checkout is unavailable until a payment provider is configured. */
function abrirCheckout(){
  if(!me()){toast('Faca login para continuar.','err');return go('/entrar?next=contratar');}
  openModal('<div class="modal-head"><div><h3>Pagamentos indisponiveis</h3><p>O checkout esta desativado.</p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div><div class="card"><p class="muted">O TaskGO ainda nao esta conectado a um provedor. Nenhuma cobranca sera criada e nenhum pedido sera marcado como pago.</p></div>');
}
function trocarMetodoCheckout(){toast('Checkout indisponivel.','err');}
function copiarCodigoCheckout(){toast('Nao ha codigo PIX valido disponivel.','err');}
function confirmarPagamentoMock(evento){if(evento)evento.preventDefault();toast('Pagamento indisponivel. Nenhuma cobranca foi enviada.','err');}
function finalizarPedido(){toast('Pedido nao criado: falta confirmar o pagamento pelo provedor.','err');}
