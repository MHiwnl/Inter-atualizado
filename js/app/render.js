/* =========================================================
   RENDER
   ========================================================= */
let opsTimer=null;
let chatPollTimer=null;
function render(){
  if(trackTimer){clearInterval(trackTimer);trackTimer=null;}
  if(opsTimer){clearInterval(opsTimer);opsTimer=null;}
  if(chatPollTimer){clearInterval(chatPollTimer);chatPollTimer=null;}
  const p=route.page;
  if(p!=='contratar')W.presetService='';
  document.body.classList.toggle('lp',!['painel','seguranca','ajuda','contato','legal','contratar'].includes(p));
  let body='',full=false;
  if(p==='entrar'){body=pageEntrar();full=true;}
  else if(p==='recuperar'){body=pageRecuperar();full=true;}
  else if(p==='painel'){body=pageDash();full=true;}
  else if(p==='servicos')body=pageServicos();
  else if(p==='como-funciona')body=pageComo();
  else if(p==='sobre')body=pageSobre();
  else if(p==='profissionais')body=pageProfissionais();
  else if(p==='planos')body=pagePlanos();
  else if(p==='seguranca')body=pageSeguranca();
  else if(p==='ajuda')body=pageAjuda();
  else if(p==='contato')body=pageContato();
  else if(p==='legal')body=pageLegal();
  else if(p==='contratar')body=pageContratar();
  else body=pageHome();
  document.getElementById('root').innerHTML=header()+'<div class="card" role="status" style="max-width:1180px;margin:10px auto;padding:10px 16px;border-color:var(--warn);color:var(--warn);font-size:.85rem">Pagamentos, carteira e saques estão desativados. Valores demonstrativos não são dinheiro real.</div>'+body+(full?'':footer().replace(/Pagamento protegido[^<]*/, 'Pagamentos indisponíveis neste ambiente'))+
    (p==='painel'||p==='entrar'?'':'<button class="fab-help" onclick="abrirChatSuporte()" title="Ajuda">'+ic('chat')+'</button>');
  if(!DEMO_MODE&&p==='home'){
    const root=document.getElementById('root');
    root.querySelector('.trust')?.setAttribute('aria-label','Estágio atual do projeto');
  }
  if(DEMO_MODE){const aviso=document.createElement('div');aviso.className='card';aviso.setAttribute('role','status');aviso.style.cssText='max-width:1180px;margin:10px auto;padding:10px 16px;border-color:var(--danger);color:var(--danger);font-size:.85rem';aviso.textContent='Modo demonstração: contas, profissionais, pedidos e avaliações exibidos são fictícios.';document.getElementById('root').prepend(aviso);}
  enhanceInteractiveButtons(document.getElementById('root'));
  /* pós-render */
  if(p==='profissionais')simular();
  if(p==='painel'){
    iniciarPollingNotificacoes();
    if(me()){
      const sincronizar=()=>{
        const email=me()?.email;if(!email)return;
        const antes=JSON.stringify(S.orders.filter(o=>o.clientEmail===email||o.proEmail===email));
        syncPedidos(email).then(()=>{
          const depois=JSON.stringify(S.orders.filter(o=>o.clientEmail===email||o.proEmail===email));
          if(antes!==depois&&route.page==='painel')render();
        }).catch(e=>console.error('Falha ao atualizar pedidos:',e));
      };
      if(!window.__taskgoOrderSync){window.__taskgoOrderSync=setInterval(sincronizar,5000);sincronizar();}
    }
    if(route.sub==='pedido')setTimeout(startTracking,60);
    else if(!route.sub)setTimeout(()=>placeMarker('mini',(S.orders.find(o=>['a_caminho','chegou','em_andamento','aguardando'].includes(o.status))||{}).progress||0),30);
    if(route.sub==='mensagens'){const b=$('#chatBox');if(b)b.scrollTop=b.scrollHeight;}
    if(route.sub==='mensagens'&&!DEMO_MODE)chatPollTimer=setInterval(async()=>{
      if(window.__taskgoChatsLoading)return;
      const orders=myOrders().filter(o=>!['aguardando','cancelado'].includes(o.status));
      try{const chats=await Promise.all(orders.map(carregarMensagensPedido));const before=JSON.stringify(S.chats),after=JSON.stringify(chats);if(before!==after){S.chats=chats;render();}}
      catch(error){console.warn('Falha ao atualizar conversas:',error);}
    },5000);
    const chatLoadKey=me()?.id+':'+myOrders().filter(o=>!['aguardando','cancelado'].includes(o.status)).map(o=>o.id).join(',');
    if(route.sub==='mensagens'&&!DEMO_MODE&&!window.__taskgoChatsLoading&&window.__taskgoChatsLoadedKey!==chatLoadKey){
      window.__taskgoChatsLoading=true;
      Promise.all(myOrders().filter(o=>!['aguardando','cancelado'].includes(o.status)).map(carregarMensagensPedido))
        .then(chats=>{S.chats=chats;window.__taskgoChatsLoadedKey=chatLoadKey;window.__taskgoChatsLoading=false;render();})
        .catch(error=>{window.__taskgoChatsLoading=false;console.error(error);toast('Não foi possível carregar as conversas salvas.','err');});
    }
    if(route.sub==='notificacoes'&&!DEMO_MODE&&!window.__taskgoNotificationsLoading&&!window.__taskgoNotificationsLoaded){
      window.__taskgoNotificationsLoading=true;
      carregarNotificacoes().then(()=>render()).catch(error=>{window.__taskgoNotificationsError=error.message;toast(error.message||'Falha ao carregar notificacoes.','err');}).finally(()=>{window.__taskgoNotificationsLoading=false;});
    }
    if(route.sub==='oportunidades')setTimeout(carregarPedidos,40);
  }
}
function abrirChatSuporte(){
  openModal('<div class="modal-head"><div><h3>Suporte TaskGO</h3><p>O chat de suporte nao esta conectado nesta versao.</p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div><p class="muted">Use o formulario para registrar uma solicitacao. A mensagem sera salva no TaskGo, mas o encaminhamento por e-mail ainda nao esta configurado.</p><a class="btn btn-primary btn-block" href="#/contato" onclick="closeModal()">Abrir formulario de contato</a>');
}

