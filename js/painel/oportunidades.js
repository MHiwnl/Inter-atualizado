/* ---------- OPORTUNIDADES (PRO) ---------- */
const API_PEDIDOS_OPORTUNIDADES=API_BASE_URL+'/api/pedidos/contratados';
let paginaOportunidades=0;
function dashOportunidades(){
  return dashHead('Oportunidades','Pedidos da sua categoria aguardando aceite. O endereço só aparece depois de aceitar.')+
    '<p class="painel-aviso"><b>Parcial:</b> distância e disponibilidade ainda não são consideradas. Ao aceitar, o pedido fica vinculado à sua conta.</p>'+
    '<div id="mural-pedidos" aria-live="polite"><div class="card center"><b>Carregando pedidos...</b></div></div>';
}
function carregarPedidos(){
  const container=document.getElementById('mural-pedidos');
  if(!container)return Promise.resolve();
  container.innerHTML='<div class="card center"><b>Carregando pedidos...</b></div>';
  const u=me(),categoria=u.service||'';
  return fetch(API_PEDIDOS_OPORTUNIDADES+'/disponiveis?page='+paginaOportunidades+'&size=20&sort=created,desc'+(categoria?'&servico='+encodeURIComponent(categoria):''))
    .then(async response=>{if(!response.ok)throw new Error('HTTP '+response.status+' '+await response.text());return response.json();})
    .then(resultado=>{
      container.innerHTML='';
      const pedidos=resultado&&Array.isArray(resultado.content)?resultado.content:[];
      if(!Array.isArray(pedidos)||!pedidos.length){container.innerHTML='<div class="card emptystate">'+ic('target')+'<b>Nenhum pedido por enquanto</b><p style="margin-top:6px">Quando um cliente pedir um serviço da sua categoria, ele aparece aqui.</p></div>';return;}
      pedidos.forEach(pedido=>{
        if(!pedido.id)return;
        const servico=SERVICES.find(item=>item.id===pedido.service);
        container.insertAdjacentHTML('beforeend','<article class="card op-in" style="margin-bottom:12px"><div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><div class="ico-box">'+ic(servico?servico.ico:'wrench')+'</div><div style="flex:1;min-width:200px"><b>'+esc(servico?servico.n:pedido.service)+'</b><p class="muted" style="margin-top:6px">'+esc(pedido.notes||'Pedido de serviço')+'</p><small class="muted">Endereço revelado após aceitar</small></div><div style="text-align:right"><b style="display:block;margin-bottom:8px">'+money(pedido.price)+'</b><button id="aceitar-'+esc(pedido.id)+'" class="btn btn-primary btn-sm" onclick="aceitarPedidoPersistido(&quot;'+esc(String(pedido.id))+'&quot;)">Aceitar pedido</button></div></div></article>');
      });
      const nav=document.createElement('div');nav.className='card';nav.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-top:12px';
      nav.innerHTML='<button class="btn btn-ghost btn-sm" '+(resultado.first?'disabled':'')+' onclick="paginaOportunidades=Math.max(0,paginaOportunidades-1);carregarPedidos()">Anterior</button><small class="muted">Página '+(resultado.page+1)+' de '+Math.max(1,resultado.totalPages)+'</small><button class="btn btn-ghost btn-sm" '+(resultado.last?'disabled':'')+' onclick="paginaOportunidades++;carregarPedidos()">Próxima</button>';
      container.appendChild(nav);
    })
    .catch(error=>{console.error('Erro ao carregar pedidos:',error);container.innerHTML='<div class="card center"><p class="muted">Não foi possível carregar pedidos do servidor. '+esc(error.message)+'</p><button class="btn btn-ghost btn-sm" onclick="carregarPedidos()">Tentar novamente</button></div>';});
}
async function aceitarPedidoPersistido(id){
  const button=document.getElementById('aceitar-'+id),u=me();
  if(!u||!u.proId)return toast('Complete seu cadastro profissional para aceitar pedidos.','err');
  if(!button||button.disabled)return;
  button.disabled=true;button.textContent='Enviando...';
  try{
    const response=await fetch(API_PEDIDOS_OPORTUNIDADES+'/'+encodeURIComponent(id)+'/aceitar',{method:'POST',headers:{'Content-Type':'application/json'}});
    const body=await response.json().catch(()=>null);
    if(!response.ok)throw new Error(body?.detail||body?.message||'Falha ao aceitar o pedido (HTTP '+response.status+').');
    if(!body||String(body.id)!==String(id))throw new Error('O servidor retornou um pedido inválido.');
    body._persisted=true;
    const i=S.orders.findIndex(o=>String(o.id)===String(id));if(i<0)S.orders.unshift(body);else S.orders[i]=Object.assign(S.orders[i],body);
    Store.save();toast('Pedido aceito! Siga para o endereço do cliente.','ok');go('/app/pedido/'+encodeURIComponent(id));
  }catch(error){
    console.error('Erro ao aceitar pedido:',error);toast(error.message||'Não foi possível aceitar o pedido.','err');
    if(button){button.disabled=false;button.textContent='Aceitar pedido';}
    await carregarPedidos();
  }
}
function ficarOffline(){
  saveUser({available:false});toast('Você está offline. Nenhum pedido será enviado.');render();
}
function ajustarRaio(){
  const u=me();
  openModal('<div class="modal-head"><div><h3>Raio de atendimento</h3><p>Receba apenas pedidos dentro da distância escolhida.</p></div><button class="icon-btn" aria-label="Fechar" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="field"><label>Distância máxima: <b id="raioL">'+(u.acceptRadius||10)+' km</b></label>'+
  '<input type="range" min="1" max="50" value="'+(u.acceptRadius||10)+'" style="width:100%" oninput="document.getElementById(\'raioL\').textContent=this.value+\' km\';window.__raio=this.value"></div>'+
  '<button class="btn btn-grad btn-block" onclick="saveUser({acceptRadius:+(window.__raio||'+(u.acceptRadius||10)+')});closeModal();toast(\'Raio atualizado\',\'ok\');render()">Salvar</button>');
}
