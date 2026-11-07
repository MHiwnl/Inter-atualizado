/* =========================================================
   RENDER
   ========================================================= */
let opsTimer=null;
let chatPollTimer=null;
const PAGE_TITLES={servicos:'Serviços',['como-funciona']:'Como funciona',profissionais:'Para profissionais',sobre:'Quem somos',planos:'Planos',entrar:'Entrar ou criar conta',recuperar:'Recuperar acesso',painel:'Perfil',app:'Minha área',seguranca:'Segurança',ajuda:'Central de ajuda',contato:'Contato',legal:'Termos e políticas',contratar:'Contratar serviço'};
function atualizarTituloAba(p){
  const detalhe=p==='servicos'&&route.sub?svc(route.sub)?.n:'';
  const nome=detalhe||PAGE_TITLES[p];
  document.title=nome?nome+' · TaskGO':'TaskGO · Conectando clientes e profissionais';
}
function render(){
  if(trackTimer){clearInterval(trackTimer);trackTimer=null;}
  if(opsTimer){clearInterval(opsTimer);opsTimer=null;}
  if(chatPollTimer){clearInterval(chatPollTimer);chatPollTimer=null;}
  const p=route.page;
  const focoAnterior=document.activeElement?.dataset?.fk;
  if(p!=='contratar')W.presetService='';
  /* data-surface separa o site da área logada (área de uso e painel de perfil). */
  const logada=p==='painel'||p==='app';
  document.documentElement.setAttribute('data-surface',logada?'app':'site');
  let body='',full=false;
  if(p==='entrar'){body=pageEntrar();full=true;}
  else if(p==='recuperar'){body=pageRecuperar();full=true;}
  else if(p==='painel'){body=pageDash();full=true;}
  else if(p==='app'){body=pageApp();full=true;}
  else if(p==='servicos')body=pageServicos();
  else if(p==='como-funciona')body=pageComo();
  else if(p==='sobre')body=pageSobre();
  else if(p==='profissionais')body=pageProfissionais();
  else if(p==='planos')body=pagePlanos();
  else if(p==='seguranca')body=pageSeguranca();
  else if(p==='ajuda')body=pageAjuda();
  else if(p==='contato')body=pageContato();
  else if(p==='legal')body=pageLegal();
  else body=pageHome();
  const pular='<a class="skip-link" href="#conteudo" onclick="event.preventDefault();document.getElementById(\'conteudo\').focus()">Pular para o conteúdo</a>';
  const conteudo=logada?pular+body:pular+header()+'<main id="conteudo" tabindex="-1">'+body+'</main>';
  document.getElementById('root').innerHTML=conteudo+(full?'':footer())+
    (logada||p==='entrar'?'':'<a class="fab-help" href="#/ajuda" title="Ajuda" aria-label="Ajuda">'+ic('help')+'</a>');
  if(DEMO_MODE){const aviso=document.createElement('div');aviso.className='demo-aviso';aviso.setAttribute('role','status');aviso.textContent='Modo demonstração: contas, profissionais, pedidos e avaliações exibidos são fictícios.';document.getElementById('root').prepend(aviso);}
  atualizarTituloAba(p);
  ligarRotulos(document.getElementById('root'));
  if(p==='app')document.querySelector('.area-abas a.active')?.scrollIntoView({inline:'center',block:'nearest',behavior:'instant'});
  if(focoAnterior)document.querySelector('[data-fk="'+focoAnterior+'"]')?.focus();
  /* pós-render */
  if(p==='profissionais')simular();
  if(p==='home')ligarVideoTopo();
  if(p==='painel')iniciarPollingNotificacoes();
  if(p==='app'){
    iniciarPollingNotificacoes();
    if(me()){
      const sincronizar=()=>{
        const email=me()?.email;if(!email)return;
        const antes=JSON.stringify(S.orders.filter(o=>o.clientEmail===email||o.proEmail===email));
        syncPedidos(email).then(()=>{
          const depois=JSON.stringify(S.orders.filter(o=>o.clientEmail===email||o.proEmail===email));
          if(antes!==depois&&route.page==='app')render();
        }).catch(e=>console.error('Falha ao atualizar pedidos:',e));
      };
      if(!window.__taskgoOrderSync){window.__taskgoOrderSync=setInterval(sincronizar,5000);sincronizar();}
    }
    if(route.sub==='pedido')setTimeout(startTracking,60);
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
