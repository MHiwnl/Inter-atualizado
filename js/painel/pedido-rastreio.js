/* ---------- DETALHE DO PEDIDO / RASTREIO ---------- */
let trackTimer=null;
let gpsWatchId=null,gpsWatchOrder=null,gpsLastSent=0;
function dashPedido(id){
  const o=S.orders.find(x=>x.id===id);
  if(!o)return '<div class="card emptystate">'+ic('x')+'Pedido não encontrado<div style="margin-top:14px"><a class="btn btn-ghost" href="#/painel/pedidos">Voltar</a></div></div>';
  const p=proById(o.proId),cli=clientOf(o),s=svc(o.service),isPro=me().role==='profissional',cp=isPro?cli:p;
  const cpRating=Number(cp.rating)||0;
  const cpRatingHtml=cpRating>0?stars(cpRating)+' '+cpRating.toFixed(1):'<span class="muted">Sem avaliações</span>';
  const reviewRating=isPro?(o.clientRating||(o.reviewByRole==='profissional'?o.rating:null)):(o.reviewByRole==='profissional'?null:o.rating);
  const stepsArr=['aguardando','a_caminho','chegou','em_andamento','concluido'];
  const curIdx=Math.max(0,stepsArr.indexOf(o.status));
  const live=o.status==='a_caminho';
  return '<a href="#/painel/pedidos" class="pill" style="margin-bottom:18px">'+ic('arrowLeft')+' Meus pedidos</a>'+
  dashHead(s.n,'Criado em '+dt(o.created),stTag(o.status))+
  '<div class="grid g2" style="grid-template-columns:1.35fr .65fr;align-items:start">'+
  '<div>'+
    (!['cancelado','aguardando'].includes(o.status)?'<div class="card">'+
      (live?'<div class="map tracking-map"><div id="mapa-rastreio" class="leaflet-tracking-map" role="application" aria-label="Última posição GPS recebida do profissional"><div class="center muted" style="padding:40px">Aguardando uma posição GPS do profissional.</div></div></div>'+ 
      '<div id="gps-status" class="muted" style="margin:12px 2px;font-size:.88rem">'+(DEMO_MODE?'Posição simulada do modo demonstração. O app não calcula rota nem previsão de chegada.':'Aguardando atualização de localização. Nenhuma rota ou previsão de chegada disponível.')+'</div>'+ 
      (isPro?'<div style="display:flex;flex-wrap:wrap;gap:8px"><button class="btn btn-grad btn-sm" onclick="iniciarCompartilhamentoGPS(\''+o.id+'\')">Compartilhar minha localização neste pedido</button><button class="btn btn-ghost btn-sm" onclick="pararCompartilhamentoPedido(\''+o.id+'\')">Parar compartilhamento</button><button class="btn btn-ghost btn-sm" onclick="informarChegada(\''+o.id+'\')">Informar que cheguei</button></div>':''):
      '<div class="center muted" style="padding:18px 0">'+(o.status==='chegou'?'Chegada informada pelo profissional. O compartilhamento de GPS foi encerrado.':o.status==='concluido'?'Serviço concluído. O compartilhamento de GPS foi encerrado.':o.status==='cancelado'?'Pedido cancelado. O compartilhamento de GPS foi encerrado.':'Rastreamento disponível quando o profissional estiver a caminho.')+'</div>')+ 
      '<div style="display:flex;justify-content:space-between;align-items:center;margin:14px 2px 0;font-size:.85rem"><span class="muted">'+(live?(isPro?'Localização compartilhada com o cliente':'Última posição compartilhada pelo profissional'):'Endereço do atendimento')+'</span>'+ 
      '<span class="muted">'+esc(o.address||'')+'</span></div>'+ 
      '<div class="track-steps">'+['Aguardando aceite','A caminho','Chegou','Em andamento','Concluído'].map((t,i)=>'<div class="tstep '+(i<curIdx?'done':i===curIdx?'now':'')+'">'+t+'</div>').join('')+'</div>'+ 
      '<div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap">'+
      '<a class="btn btn-ghost btn-sm" href="#/painel/mensagens">'+ic('chat')+' Mensagem</a>'+
      '<button class="btn btn-danger btn-sm" onclick="emergencia()">'+ic('phone')+' Ligar para 190 ou 192</button></div>'+
    '</div>':'')+
    /* CÓDIGO */
    (['a_caminho','chegou'].includes(o.status)?(isPro
     /* PROFISSIONAL: digita o código que o cliente informa */
     ?(o.status==='chegou'?'<div class="card" style="margin-top:20px;text-align:center;border-top-color:var(--brand)">'+
      '<div class="ico-box" style="margin:0 auto 12px">'+ic('key')+'</div>'+
      '<h2 class="sub" style="font-size:1.05rem">Validação de chegada</h2>'+
      '<p class="muted" style="font-size:.88rem;margin-top:6px;max-width:440px;margin-inline:auto">Ao chegar, peça ao cliente o código de 4 dígitos que aparece no aplicativo dele e digite abaixo. O serviço só começa depois disso.</p>'+
      '<div class="code-boxes">'+[0,1,2,3].map(i=>'<input id="cb'+i+'" inputmode="numeric" maxlength="1" oninput="cbNext('+i+')">').join('')+'</div>'+
      '<button class="btn btn-grad" onclick="validarCodigo(\''+o.id+'\')">'+ic('checkCircle')+' Validar e iniciar serviço</button>'+
      '</div>':'<div class="card" style="margin-top:20px"><b>Aguardando chegada</b><p class="muted">O código só pode ser informado depois que o profissional registrar a chegada no pedido.</p></div>')
     /* CLIENTE: mostra o código para informar ao profissional */
     :'<div class="card" style="margin-top:20px;text-align:center;border-top-color:var(--brand)">'+
      '<div class="ico-box" style="margin:0 auto 12px">'+ic('key')+'</div>'+
      '<h2 class="sub" style="font-size:1.05rem">Seu código de segurança</h2>'+
      '<p class="muted" style="font-size:.88rem;margin-top:6px;max-width:440px;margin-inline:auto">Informe este código a '+esc(p.name.split(' ')[0])+' somente quando ele chegar ao local. Ele digita o código no app para iniciar o serviço.</p>'+
      '<div class="big-code" style="margin:20px 0">'+o.code+'</div>'+
      '<span class="pill '+(o.status==='chegou'?'pill-brand':'')+'">'+(o.status==='chegou'?ic('mapPin')+' O profissional chegou — informe o código':ic('clock')+' Aguardando a chegada do profissional')+'</span>'+
      '<details class="demo-note"><summary>Testar a visão do profissional</summary><span class="demo-note-content">Crie ou acesse uma conta profissional para acompanhar o pedido por esse perfil.</span></details></div>'):'')+
    (o.status==='aguardando'?(isPro?
     '<div class="card" style="margin-top:20px;border-top-color:var(--brand)">'+
     '<div style="display:flex;gap:14px;align-items:flex-start"><div class="ico-box">'+ic('bell')+'</div><div style="flex:1"><b>Novo pedido recebido</b><p class="muted" style="font-size:.88rem;margin-top:6px">'+esc(cli.name)+' solicitou '+esc(s.n)+' por '+money(o.price)+'. Revise o endereço e confirme se pode atender.</p></div></div>'+ 
     '<div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap"><button class="btn btn-ghost" onclick="recusarPedidoCliente(\''+o.id+'\')">Recusar pedido</button><button class="btn btn-grad" onclick="confirmarPedidoCliente(\''+o.id+'\')">'+ic('check')+' Confirmar atendimento</button></div></div>'
     :'<div class="card" style="margin-top:20px;border-top-color:var(--brand)"><b>Aguardando confirmação do profissional</b><p class="muted" style="font-size:.88rem;margin-top:6px">Seu pedido foi enviado para '+esc(p.name)+'. Avisaremos assim que ele confirmar o atendimento.</p></div>'):'')+
    (o.status==='em_andamento'?
     '<div class="card" style="margin-top:20px;display:flex;gap:16px;align-items:center;flex-wrap:wrap">'+
     '<div class="ico-box">'+ic('play')+'</div><div style="flex:1;min-width:200px"><b>Serviço em andamento</b>'+
     '<p class="muted" style="font-size:.88rem">Iniciado após validação do código. Ao terminar, confirme a conclusão para liberar o pagamento.</p></div>'+
     '<button class="btn btn-grad" onclick="concluirServico(\''+o.id+'\')">'+ic('check')+' Concluir serviço</button></div>':'')+
    (o.status==='concluido'?
     '<div class="card" style="margin-top:20px">'+
     '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div class="ico-box" style="background:color-mix(in srgb,var(--accent) 14%,transparent)">'+ic('checkCircle')+'</div>'+
     '<div style="flex:1;min-width:200px"><b>'+(isPro?'Serviço concluído':'Pedido finalizado')+'</b><p class="muted" style="font-size:.88rem">'+(reviewRating?'Você avaliou com '+reviewRating+' estrelas.':(isPro?'Conte como foi sua experiência com o cliente.':'Avalie o profissional que realizou o serviço.'))+'</p></div>'+ 
     (reviewRating?stars(reviewRating):'<button class="btn btn-primary" onclick="abrirAvaliacao(\''+o.id+'\')">'+ic('star')+' '+(isPro?'Avaliar cliente':'Avaliar profissional')+'</button>')+'</div>'+ 
     '<div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" onclick="baixarRecibo(\''+o.id+'\')">'+ic('file')+' Baixar recibo</button>'+
     '<a class="btn btn-ghost btn-sm" href="#/contratar?servico='+o.service+'">'+ic('refresh')+' Contratar novamente</a></div></div>':'')+
    (o.notes?'<div class="card" style="margin-top:20px"><b style="font-size:.9rem">Descrição do pedido</b><p class="muted" style="font-size:.9rem;margin-top:8px">'+esc(o.notes)+'</p></div>':'')+
  '</div>'+
  '<div>'+
    '<div class="card"><h2 class="sub" style="font-size:1rem;margin-bottom:16px">'+(isPro?'Cliente':'Profissional')+'</h2>'+
    '<div style="display:flex;gap:12px;align-items:center">'+avatar({name:cp.name},52)+
    '<div><b style="display:block">'+esc(cp.name)+'</b><span class="muted" style="font-size:.8rem">'+cpRatingHtml+' · '+
      (isPro?(Number(cli.jobs)||0)+' pedidos na TaskGO':p.reviews+' avaliações')+'</span>'+ 
    '</div></div>'+ 
    (isPro?'<div style="margin-top:14px">'+
       '<div style="display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--line)"><span class="muted" style="font-size:.84rem">Telefone</span><b style="font-size:.84rem">'+esc(cli.phone||'—')+'</b></div>'+
       '<div style="display:flex;justify-content:space-between;gap:12px;padding:9px 0"><span class="muted" style="font-size:.84rem">Cliente desde</span><b style="font-size:.84rem">'+new Date(cli.since||Date.now()).toLocaleDateString('pt-BR',{month:'short',year:'numeric'})+'</b></div></div>'
          :'<p class="muted" style="font-size:.86rem;margin-top:14px">'+esc(p.bio)+'</p>')+'</div>'+
    '<div class="card" style="margin-top:16px"><h2 class="sub" style="font-size:1rem;margin-bottom:14px">Resumo</h2>'+
    [['Endereço',o.address||'—'],['Categoria',s.n],['Pagamento','Ainda não disponível'],['Valor',money(o.price)]]
    .map(r=>'<div style="display:flex;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid var(--line)"><span class="muted" style="font-size:.85rem">'+r[0]+'</span><b style="font-size:.85rem;text-align:right">'+esc(r[1])+'</b></div>').join('')+
    (['a_caminho','agendado','aguardando'].includes(o.status)?'<button class="btn btn-danger btn-block" style="margin-top:16px" onclick="cancelarPedido(\''+o.id+'\')">Cancelar pedido</button>':'')+
    '</div>'+
    '<div class="card" style="margin-top:16px">'+
    '<div style="display:flex;gap:10px"><div style="flex:none">'+ic(isPro?'key':'shield')+'</div><div><b style="font-size:.88rem">'+(isPro?'Antes de iniciar':'Sem garantia por enquanto')+'</b>'+
    '<p class="muted" style="font-size:.84rem;margin-top:4px">'+(isPro?'Peça o código de 4 dígitos ao cliente e valide no app. Só depois inicie o serviço.':'A TaskGO ainda não oferece garantia nem cobertura de danos.')+'</p></div></div></div>'+
  '</div></div>';
}
function startTracking(){
  const o=S.orders.find(x=>x.id===route.id);
  if(!o)return;
  if(!DEMO_MODE){
    if(o.status!=='a_caminho'){pararCompartilhamentoGPS();return;}
    obterLocalizacaoPedido(o.id);
    if(me().role!=='profissional')trackTimer=setInterval(()=>obterLocalizacaoPedido(o.id),15000);
    return;
  }
  initTrackingMap(o.id,o.progress||0);
  placeMarker('live',o.progress||0);
  if(o.status!=='a_caminho')return;
  const duration=45000;
  if(!o.trackingStartedAt)o.trackingStartedAt=Date.now()-(Math.max(0,Math.min(1,o.progress||0))*duration);
  trackTimer=setInterval(()=>{
    o.progress=Math.max(0,Math.min(1,(Date.now()-o.trackingStartedAt)/duration));
    const totalDist=4.6;
    o.dist=+((1-o.progress)*totalDist).toFixed(1);
    o.eta=Math.max(1,Math.round((1-o.progress)*18));
    placeMarker('live',o.progress);
    const d=$('#liveDist'),e=$('#liveEta');
    if(d)d.textContent=(o.dist==null?'—':Number(o.dist).toFixed(1));
    if(e)e.textContent=o.eta;
    if(o.progress>=1){
      clearInterval(trackTimer);trackTimer=null;
      guardarPedidoAlterado(o,{status:'chegou'}).then(()=>{toast('O profissional chegou ao local!','ok');render();}).catch(error=>{toast(error.message||'O servidor não confirmou a chegada.','err');render();});
    }else Store.save();
  },300);
}
function gpsStatus(message){const el=$('#gps-status');if(el)el.textContent=message;}
function pararCompartilhamentoGPS(){
  if(gpsWatchId!==null&&navigator.geolocation)navigator.geolocation.clearWatch(gpsWatchId);
  gpsWatchId=null;gpsWatchOrder=null;gpsLastSent=0;
}
async function iniciarCompartilhamentoGPS(id){
  if(DEMO_MODE)return toast('O rastreamento GPS real não está disponível no modo de demonstração.');
  const o=S.orders.find(item=>item.id===id);
  if(!o||o.status!=='a_caminho'||me().role!=='profissional')return toast('O rastreamento não está autorizado para este pedido.','err');
  if(!navigator.geolocation)return toast('Este dispositivo não oferece geolocalização. Nenhuma posição foi enviada.','err');
  openModal('<div class="modal-head"><div><h3>Compartilhar localização</h3><p>Enquanto este pedido estiver a caminho, sua posição e precisão serão enviadas ao cliente deste pedido.</p></div><button class="icon-btn" aria-label="Fechar" onclick="closeModal()">'+ic('x')+'</button></div><p class="muted" style="margin:12px 0">O compartilhamento para ao informar chegada, cancelar o pedido ou fechar esta página. A localização pode ser aproximada e depende do dispositivo.</p><button class="btn btn-grad btn-block" onclick="confirmarCompartilhamentoGPS(\''+id+'\')">Concordo e iniciar GPS</button>');
}
function confirmarCompartilhamentoGPS(id){
  closeModal();pararCompartilhamentoGPS();gpsWatchOrder=id;gpsStatus('Solicitando permissão de localização ao dispositivo…');
  gpsWatchId=navigator.geolocation.watchPosition(async position=>{
    if(gpsWatchOrder!==id)return;
    const now=Date.now();if(now-gpsLastSent<15000)return;gpsLastSent=now;
    gpsStatus('Enviando atualização de localização…');
    try{
      const response=await fetch(API_BASE_URL+'/api/pedidos/contratados/'+encodeURIComponent(id)+'/localizacao',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({latitude:position.coords.latitude,longitude:position.coords.longitude,accuracy:position.coords.accuracy,measuredAt:position.timestamp})});
      if(!response.ok){if(response.status===409||response.status===403)pararCompartilhamentoGPS();throw new Error(response.status===403?'A conta não está autorizada para compartilhar neste pedido.':response.status===409?'O pedido não está mais na etapa de rastreamento.':'Falha ao salvar localização no servidor.');}
      const data=await response.json();renderGpsPosition(data);
    }catch(error){gpsStatus(error.message||'Falha de conexão. A posição não foi confirmada pelo servidor.');}
  },error=>{
    const message=error.code===1?'Permissão de localização negada. Nenhuma posição fictícia será exibida.':error.code===2?'Localização indisponível no dispositivo.':error.code===3?'Tempo esgotado ao obter localização.':'Falha ao obter localização.';
    gpsStatus(message);
  },{enableHighAccuracy:true,maximumAge:5000,timeout:20000});
  gpsStatus('Aguardando a primeira posição do dispositivo…');
}
async function obterLocalizacaoPedido(id){
  try{
    const response=await fetch(API_BASE_URL+'/api/pedidos/contratados/'+encodeURIComponent(id)+'/localizacao');
    if(response.status===204){gpsStatus('Aguardando o profissional compartilhar sua posição. Nenhuma posição ou previsão foi inventada.');return;}
    if(!response.ok)throw new Error(response.status===403?'Sem autorização para consultar a localização deste pedido.':'Não foi possível consultar a localização.');
    renderGpsPosition(await response.json());
  }catch(error){gpsStatus(error.message||'Localização temporariamente indisponível.');}
}
function renderGpsPosition(position){
  const mapNode=$('#mapa-rastreio');if(!mapNode||!window.L)return;
  const measured=Number(position.measuredAt),age=Date.now()-measured,stale=age>60000;
  const label=new Date(measured).toLocaleString('pt-BR');
  gpsStatus((stale?'Última posição desatualizada':'Última atualização: '+label)+' · precisão aproximada de '+Math.round(Number(position.accuracy))+' m. A localização do dispositivo não é prova absoluta da posição física.');
  if(window.taskgoGpsMap&&window.taskgoGpsMapNode!==mapNode){window.taskgoGpsMap.remove();window.taskgoGpsMap=null;window.taskgoGpsMarker=null;window.taskgoGpsAccuracy=null;}
  if(!window.taskgoGpsMap){
    mapNode.replaceChildren();const map=L.map(mapNode,{scrollWheelZoom:false,doubleClickZoom:false});
    window.taskgoGpsMap=map;window.taskgoGpsMapNode=mapNode;window.taskgoGpsMarker=L.circleMarker([position.latitude,position.longitude],{radius:9,color:'#fff',weight:3,fillColor:'#2b59ff',fillOpacity:.95}).addTo(map);
    window.taskgoGpsAccuracy=L.circle([position.latitude,position.longitude],{radius:Math.max(1,Number(position.accuracy)),color:'#2b59ff',weight:1,fillOpacity:.12}).addTo(map);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'}).addTo(map);
    map.setView([position.latitude,position.longitude],16);
  }else{
    const point=[position.latitude,position.longitude];window.taskgoGpsMarker.setLatLng(point);window.taskgoGpsAccuracy.setLatLng(point).setRadius(Math.max(1,Number(position.accuracy)));window.taskgoGpsMap.panTo(point);
  }
  requestAnimationFrame(()=>window.taskgoGpsMap&&window.taskgoGpsMap.invalidateSize());
}
async function informarChegada(id){
  const o=S.orders.find(item=>item.id===id);if(!o||me().role!=='profissional'||o.status!=='a_caminho')return toast('Não foi possível informar a chegada neste pedido.','err');
  try{await guardarPedidoAlterado(o,{status:'chegou'});pararCompartilhamentoGPS();toast('Chegada registrada pelo profissional.','ok');render();}
  catch(error){toast(error.message||'O servidor não confirmou a chegada.','err');}
}
async function pararCompartilhamentoPedido(id){
  try{const response=await fetch(API_BASE_URL+'/api/pedidos/contratados/'+encodeURIComponent(id)+'/localizacao',{method:'DELETE'});if(!response.ok)throw new Error('O servidor não confirmou o encerramento.');pararCompartilhamentoGPS();if(window.taskgoGpsMap){window.taskgoGpsMap.remove();window.taskgoGpsMap=null;window.taskgoGpsMapNode=null;}const node=$('#mapa-rastreio');if(node)node.innerHTML='<div class="card center muted" style="padding:40px">Compartilhamento de localização encerrado.</div>';gpsStatus('Compartilhamento encerrado. Para voltar a compartilhar, solicite novamente.');}
  catch(error){toast(error.message||'Não foi possível encerrar o compartilhamento.','err');}
}
window.addEventListener('hashchange',()=>{if(!location.hash.includes('/painel/pedido/'))pararCompartilhamentoGPS();});
window.addEventListener('beforeunload',pararCompartilhamentoGPS);
function abrirValidacao(id){
  openModal('<div class="modal-head"><div><h3>Validar chegada</h3><p>Digite o código de 4 dígitos para iniciar o serviço.</p></div><button class="icon-btn" aria-label="Fechar" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="code-boxes">'+[0,1,2,3].map(i=>'<input id="cb'+i+'" inputmode="numeric" maxlength="1" oninput="cbNext('+i+')">').join('')+'</div>'+
  '<p class="hint center" style="margin-bottom:16px">Nunca compartilhe o código antes do profissional chegar.</p>'+
  '<button class="btn btn-grad btn-block" onclick="validarCodigo(\''+id+'\')">Confirmar</button>',
  {onOpen:()=>{const f=$('#cb0');if(f)f.focus();}});
}
function cbNext(i){const el=$('#cb'+i);el.value=el.value.replace(/\D/g,'');if(el.value&&i<3)$('#cb'+(i+1)).focus();}
async function validarCodigo(id){
  const o=S.orders.find(x=>x.id===id);
  const v=[0,1,2,3].map(i=>($('#cb'+i)||{}).value||'').join('');
  if(v!==o.code)return toast('Código incorreto. Confira com o profissional.','err');
  try{await guardarPedidoAlterado(o,{status:'em_andamento',progress:1});closeModal();toast('Chegada validada! Serviço iniciado.','ok');render();}
  catch(error){toast(error.message||'O servidor não confirmou o início do serviço.','err');}
}
async function confirmarPedidoCliente(id){
  const order=S.orders.find(item=>item.id===id),user=me();
  if(!order||!user||user.role!=='profissional'||order.proId!==user.proId)return toast('Este pedido não pertence ao seu perfil.','err');
  if(order.status!=='aguardando')return toast('Este pedido já foi respondido.','err');
  try{
    const response=await fetch(API_BASE_URL+'/api/pedidos/contratados/'+encodeURIComponent(id)+'/aceitar',{method:'POST'});
    if(!response.ok)throw new Error('O servidor não confirmou o aceite.');
    Object.assign(order,await response.json());toast('Atendimento confirmado.','ok');render();
  }catch(error){toast(error.message||'Não foi possível aceitar o pedido.','err');}
}
async function recusarPedidoCliente(id){
  const o=S.orders.find(x=>x.id===id),u=me();
  if(!o||!u||u.role!=='profissional'||o.proId!==u.proId)return toast('Este pedido não pertence ao seu perfil.','err');
  if(o.status!=='aguardando')return toast('Este pedido já foi respondido.','err');
  try{await guardarPedidoAlterado(o,{status:'cancelado',cancelReason:'professional_unavailable'});toast('Pedido recusado.','ok');go('/painel/pedidos');}
  catch(error){toast(error.message||'O servidor não confirmou a recusa.','err');}
}
let ratingVal=5;
function abrirAvaliacao(id){
  ratingVal=1;
  const isPro=me().role==='profissional';
  const reviewTags=isPro
    ? ['Comunicativo','Respeitoso','Acesso facilitado','Informa\u00e7\u00f5es claras','Local organizado','Colaborativo']
    : ['Pontual','Educado','Caprichoso','Pre\u00e7o justo','Limpo','R\u00e1pido'];
  const reviewTitle=isPro?'Avalie o cliente':'Avalie o profissional';
  const reviewSubtitle=isPro
    ? 'Sua avalia\u00e7\u00e3o ajuda outros profissionais da TaskGO.'
    : 'Sua opini\u00e3o ajuda toda a comunidade TaskGO.';
  const reviewPlaceholder=isPro
    ? 'Como foi a comunica\u00e7\u00e3o e o atendimento do cliente?'
    : 'Conte como foi o servi\u00e7o...';
  openModal('<div class="modal-head"><div><h3>'+reviewTitle+'</h3><p>'+reviewSubtitle+'</p></div><button class="icon-btn" aria-label="Fechar" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div id="rstars" role="group" aria-label="Escolha uma nota de 1 a 5 estrelas" style="display:flex;gap:8px;justify-content:center;margin:10px 0 20px">'+
  [1,2,3,4,5].map(i=>'<button type="button" aria-label="Avaliar com '+i+' '+(i===1?'estrela':'estrelas')+'" aria-pressed="'+(i===1?'true':'false')+'" onclick="setRating('+i+')" style="background:none;border:0;cursor:pointer;padding:0"><svg viewBox="0 0 24 24" style="width:38px;height:38px;fill:var(--warn);opacity:'+(i<=ratingVal?1:.25)+';transition:opacity .15s,transform .15s" data-s="'+i+'">'+I.star+'</svg></button>').join('')+'</div>'+ 
  '<div class="field"><label>Coment\u00e1rio (opcional)</label><textarea class="textarea" id="rcom" placeholder="'+reviewPlaceholder+'"></textarea></div>'+
  '<div id="reviewTags" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px">'+reviewTags.map(t=>'<button type="button" class="pill" aria-pressed="false" onclick="toggleReviewTag(this)">'+t+'</button>').join('')+'</div>'+
  '<button class="btn btn-grad btn-block" onclick="salvarAvaliacao(\''+id+'\')">Enviar avalia\u00e7\u00e3o</button>');
}
function toggleReviewTag(button){
  const selected=button.classList.toggle('pill-brand');
  button.setAttribute('aria-pressed',selected?'true':'false');
}
function setRating(n){
  ratingVal=Math.max(1,Math.min(5,Number(n)||1));
  $$('#rstars button').forEach((b,i)=>{
    const star=i+1;
    b.setAttribute('aria-pressed',star===ratingVal?'true':'false');
    const svg=b.querySelector('svg');
    if(svg){svg.style.opacity=star<=ratingVal?1:.25;svg.style.transform=star<=ratingVal?'scale(1.06)':'scale(1)';}
  });
}
async function salvarAvaliacao(id){
  const order=S.orders.find(x=>x.id===id);if(!order)return toast('Pedido não encontrado.','err');
  try{
    const response=await fetch(API_BASE_URL+'/api/pedidos/contratados/'+encodeURIComponent(id)+'/avaliacoes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({rating:ratingVal,comment:($('#rcom')||{}).value||''})});
    if(!response.ok)throw new Error('A avaliação não foi confirmada pelo servidor.');
    const saved=await response.json();Object.assign(order,saved);closeModal();toast('Avaliação salva. Obrigado!','ok');render();
  }catch(error){toast(error.message||'Não foi possível salvar a avaliação.','err');}
}
function cancelarPedido(id){
  openModal('<div class="modal-head"><div><h3>Cancelar pedido</h3><p>Essa ação não pode ser desfeita.</p></div><button class="icon-btn" aria-label="Fechar" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="field"><label>Motivo do cancelamento</label><select class="select" id="cmot"><option>Resolvi o problema sozinho</option><option>Encontrei outro profissional</option><option>O valor ficou acima do esperado</option><option>Demora no atendimento</option><option>Outro motivo</option></select></div>'+
  '<p class="aviso-linha" style="margin-bottom:18px">Ao cancelar, o pedido deixa de valer para as duas pessoas. A plataforma não cobra taxa, porque ainda não há pagamento.</p>'+
  '<div style="display:flex;gap:10px"><button class="btn btn-ghost btn-block" onclick="closeModal()">Voltar</button>'+
  '<button class="btn btn-danger btn-block" onclick="confirmarCancel(\''+id+'\')">Cancelar pedido</button></div>');
}
async function confirmarCancel(id){
  const o=S.orders.find(x=>x.id===id);if(!o)return toast('Pedido não encontrado.','err');
  try{await guardarPedidoAlterado(o,{status:'cancelado',cancelReason:(($('#cmot')||{}).value||o.cancelReason||'')});closeModal();toast('Pedido cancelado.','ok');render();}
  catch(error){toast(error.message||'O servidor não confirmou o cancelamento.','err');}
}
/* A TaskGO não tem equipe de plantão: o modal leva direto aos serviços públicos. */
function emergencia(){
  openModal('<div class="modal-head"><div><h3 style="color:var(--danger-text)">Emergência</h3><p>A TaskGO ainda não tem equipe de segurança de plantão. Procure ajuda direto:</p></div><button class="icon-btn" aria-label="Fechar" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div style="display:flex;flex-direction:column;gap:10px">'+
  '<a class="btn btn-danger btn-block" href="tel:190">'+ic('phone')+' Ligar para a Polícia Militar (190)</a>'+
  '<a class="btn btn-danger btn-block" href="tel:192">'+ic('phone')+' Ligar para o SAMU (192)</a></div>');
}
function baixarRecibo(id){toast('Recibos ainda não estão disponíveis: não há pagamento pela plataforma.','err');}

