/* ---------- STORAGE ---------- */
const KEY='taskgo.v3';
const API_BASE=API_BASE_URL;
const taskgoNativeFetch=window.fetch.bind(window);
window.fetch=async function(input,init={}){
  const url=new URL(typeof input==='string'?input:input.url,location.href);
  if(url.origin!==API_ORIGIN||!url.pathname.startsWith('/api/'))return taskgoNativeFetch(input,init);
  const method=(init.method||'GET').toUpperCase();
  const options={...init,credentials:'include',headers:new Headers(init.headers||(input instanceof Request?input.headers:undefined))};
  if(!['GET','HEAD','OPTIONS','TRACE'].includes(method)&&!url.pathname.endsWith('/api/auth/csrf')){
    let token=decodeURIComponent((document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/)||[])[1]||'');
    if(!token){await taskgoNativeFetch(API_BASE_URL+'/api/auth/csrf',{credentials:'include'});token=decodeURIComponent((document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/)||[])[1]||'');}
    if(token)options.headers.set('X-XSRF-TOKEN',token);
  }
  return taskgoNativeFetch(input,options);
};
const API_PEDIDOS=API_BASE_URL+'/api/pedidos/contratados';
const isDemoMode=()=>typeof DEMO_MODE!=='undefined'&&DEMO_MODE;
async function carregarProfissionaisPersistidos(servico){
  const url=API_BASE_URL+'/api/profissionais'+(servico?'?servico='+encodeURIComponent(servico):'');
  const response=await fetch(url);if(!response.ok)throw new Error('Não foi possível carregar profissionais cadastrados.');
  const profissionais=await response.json();if(!Array.isArray(profissionais))throw new Error('Resposta inválida do catálogo de profissionais.');
  S.pros=profissionais.map(p=>({id:p.id,name:p.name,service:p.service,city:p.city,bio:p.bio,rating:p.rating,reviews:p.reviews}));return S.pros;
}
async function syncPedidos(email){
  if(!email)return [];
  const resposta=await fetch(API_PEDIDOS);
  if(!resposta.ok)throw new Error('Não foi possível carregar os pedidos salvos.');
  const pedidos=await resposta.json();
  pedidos.forEach(pedido=>{pedido._persisted=true;const indice=S.orders.findIndex(item=>item.id===pedido.id);if(indice<0)S.orders.unshift(pedido);else S.orders[indice]=Object.assign(S.orders[indice],pedido);});
  Store.save();return pedidos;
}
async function syncDadosConta(email){
  const resposta=await fetch(API_BASE_URL+'/api/auth/dados');
  if(!resposta.ok)throw new Error('NÃ£o foi possÃ­vel carregar os dados da conta.');
  const dados=await resposta.json(),u=S.users.find(item=>String(item.email||'').toLowerCase()===String(email).toLowerCase());
  if(u&&dados.profile){const perfil=Object.assign({},dados.profile);delete perfil.professional;Object.assign(u,perfil);}
  if(u)S.notifs=[];
  Store.save();
}
async function carregarMensagensPedido(orderId){
  const response=await fetch(API_PEDIDOS+'/'+encodeURIComponent(orderId)+'/mensagens');
  if(!response.ok)throw new Error('Não foi possível carregar as mensagens do pedido.');
  const messages=await response.json(),u=me();
  return {id:String(orderId),orderId:String(orderId),msgs:messages.map(m=>({id:m.id,me:String(m.autorId)===String(u.id).replace(/^db_/,''),recipientId:m.destinatarioId,automatic:m.automatica,readAt:m.lidaEm,t:m.texto,ts:m.criadaEm}))};
}
async function enviarMensagemPedido(orderId,texto,clientMessageId){
  const response=await fetch(API_PEDIDOS+'/'+encodeURIComponent(orderId)+'/mensagens',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientMessageId,texto})});
  if(!response.ok)throw new Error('A mensagem não foi confirmada pelo servidor.');
  const m=await response.json(),u=me();
  return {id:m.id,me:String(m.autorId)===String(u.id).replace(/^db_/,''),recipientId:m.destinatarioId,automatic:m.automatica,readAt:m.lidaEm,t:m.texto,ts:m.criadaEm};
}
async function carregarNotificacoes(){
  const response=await fetch(API_BASE_URL+'/api/notificacoes');
  if(!response.ok)throw new Error('Nao foi possivel carregar as notificacoes do servidor.');
  const rows=await response.json();
  S.notifs=rows.map(n=>({id:n.id,userId:me()?.id,t:n.titulo,d:n.conteudo,ts:n.criadaEm,read:n.lidaEm!=null,kind:n.tipo,route:n.pedidoId?'/painel/pedido/'+n.pedidoId:null,channel:n.canal,deliveryStatus:n.statusEntrega}));
  window.__taskgoNotificationsLoaded=true;window.__taskgoNotificationsError='';
  return S.notifs;
}
async function marcarNotificacaoLida(id){
  const response=await fetch(API_BASE_URL+'/api/notificacoes/'+encodeURIComponent(id)+'/lida',{method:'PATCH'});
  if(!response.ok)throw new Error('Nao foi possivel atualizar a notificacao.');
}
async function marcarTodasNotificacoesLidas(){
  const response=await fetch(API_BASE_URL+'/api/notificacoes/lidas',{method:'PATCH'});
  if(!response.ok)throw new Error('Nao foi possivel atualizar as notificacoes.');
}
async function persistirPedido(pedido, email){
  const novo=!pedido._persisted;
  const url=novo?API_PEDIDOS:API_PEDIDOS+'/'+encodeURIComponent(pedido.id);
  const resposta=await fetch(url,{method:novo?'POST':'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(pedido)});
  if(!resposta.ok){const texto=await resposta.text();throw new Error(texto||'Não foi possível salvar o pedido.');}
  const salvo=await resposta.json();Object.assign(pedido,salvo,{_persisted:true});return pedido;
}
async function guardarPedidoAlterado(pedido,alteracoes={}){
  const atualizado=Object.assign({},pedido,alteracoes);
  const salvo=await persistirPedido(atualizado,me()?.email);
  Object.assign(pedido,salvo,{_persisted:true});
  Store.save();
  return pedido;
}
const Store={
  data:null,
  load(){
    if(!isDemoMode()){this.data=seed();return this.data;}
    try{const raw=localStorage.getItem(KEY);if(raw)this.data=JSON.parse(raw);}catch(e){this.data=null;}
    const base=seed();
    if(!this.data||!this.data.users)this.data=base;
    else ['users','pros','clients','orders','tx','chats','notifs'].forEach(k=>{if(!Array.isArray(this.data[k]))this.data[k]=base[k];});
    let changed=true;
    this.data.session=null;
    this.data.users.forEach(user=>{for(const key of ['pass','password','senha'])if(Object.prototype.hasOwnProperty.call(user,key)){delete user[key];changed=true;}});
    this.data.tx.forEach(t=>{
      if(t.ownerId)return;
      if(/^t[1-6]$/.test(t.id))t.ownerId=t.id==='t4'?'u_cliente':'u_pro';
      else if(/^Pagamento recebido|^Taxa de servi/i.test(t.label||''))t.ownerId='u_pro';
      else if(/^Pagamento(?! recebido)/i.test(t.label||''))t.ownerId='u_cliente';
      else if(/^Dep|^Saque para chave PIX|^Taxa de saque/i.test(t.label||''))t.ownerId=this.data.session||'';
      if(t.ownerId)changed=true;
    });
    this.data.notifs.forEach(n=>{
      if(n.userId||n.for)return;
      const order=n.orderId&&this.data.orders.find(o=>o.id===n.orderId);
      n.userId=order?order.clientId:this.data.session||'';
      if(n.userId)changed=true;
    });
    base.pros.filter(p=>/^pro\d+$/.test(p.id)).forEach(template=>{
      const existing=this.data.pros.find(p=>p.id===template.id);
      if(!existing){this.data.pros.push(template);changed=true;return;}
      const service=svc(existing.service);
      if(Number(existing.price)<service.min||Number(existing.price)>service.max){existing.price=template.price;changed=true;}
    });
    if(changed)this.save();
    return this.data;
  },
  save(){
    if(!isDemoMode())return;
    try{const safe=JSON.parse(JSON.stringify(this.data));safe.session=null;const clean=value=>{if(Array.isArray(value)){value.forEach(clean);return;}if(value&&typeof value==='object'){Object.keys(value).forEach(key=>{const normalized=key.toLowerCase().replace(/[^a-z]/g,'');if(['pass','password','senha','passwordhash','token','accesstoken','refreshtoken','sessionid','jsessionid'].includes(normalized)){delete value[key];return;}clean(value[key]);});}};clean(safe);localStorage.setItem(KEY,JSON.stringify(safe));}catch(e){}
    try{
      if(window.__taskgoHydrating||typeof me!=='function'||!me()?.id?.startsWith('db_'))return;
      const u=me();
      const dados={profile:{pixKey:u.pixKey,notif:u.notif,twofa:u.twofa,available:u.available,acceptRadius:u.acceptRadius,professional:S.pros.find(p=>p.id===u.proId)||null}};
      const assinatura=JSON.stringify(dados);if(assinatura===window.__taskgoDataSignature)return;
      window.__taskgoDataSignature=assinatura;clearTimeout(window.__taskgoDataSaveTimer);
      window.__taskgoDataSaveTimer=setTimeout(()=>{
        const atual=me();if(!atual)return;
        fetch(API_BASE_URL+'/api/auth/dados',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:atual.email,dados})})
          .catch(e=>{window.__taskgoDataSignature=null;console.error('Falha ao salvar dados da conta:',e);});
      },800);
    }catch(e){}
  },
  reset(){if(!isDemoMode())return;try{localStorage.removeItem(KEY);}catch(e){}this.data=seed();this.save();}
};

