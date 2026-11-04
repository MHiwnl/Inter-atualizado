/* ---------- ESTADO ---------- */
const S=Store.load();
const me=()=>S.users.find(u=>u.id===S.session)||null;
const proById=id=>S.pros.find(p=>p.id===id)||S.users.find(u=>u.proId===id)||null;
function clientOf(o){
  return S.users.find(u=>u.id===o.clientId||String(u.email||'').toLowerCase()===String(o.clientEmail||'').toLowerCase())||(S.clients||[]).find(c=>c.id===o.clientId)||
     {id:o.clientId,name:o.clientName||'Cliente',address:o.address};
}
/* quem aparece do outro lado do pedido, do ponto de vista de quem está logado */
function counterpart(o){const u=me();if(u&&u.role==='profissional')return clientOf(o);return S.users.find(x=>x.email&&x.email.toLowerCase()===String(o.proEmail||'').toLowerCase())||S.pros.find(x=>x.id===o.proId)||{name:o.professionalName||'Profissional'};}
function counterLabel(){const u=me();return (u&&u.role==='profissional')?'Cliente':'Profissional';}
function myNotifs(){
  if(!DEMO_MODE)return S.notifs||[];
  const u=me();if(!u)return[];
  const createdAt=Number(u.since)||0;
  return S.notifs.filter(n=>{
    if(n.userId)return n.userId===u.id;
    if(n.for&&n.for!==u.role)return false;
    // Avisos antigos de demonstração não devem aparecer para contas criadas depois deles.
    return !createdAt||!n.ts||Number(n.ts)>=createdAt;
  }).sort((a,b)=>(b.ts||0)-(a.ts||0));
}
function notifyUser(userId,t,d,meta={}){
  if(!DEMO_MODE)return null;
  if(!userId||!S.users.some(u=>u.id===userId))return null;
  if(meta.type&&meta.orderId&&S.notifs.some(n=>n.userId===userId&&n.type===meta.type&&n.orderId===meta.orderId))return null;
  const n=Object.assign({id:uid(),userId,t,d,ts:Date.now(),read:false},meta);
  S.notifs.unshift(n);S.notifs=S.notifs.slice(0,200);Store.save();return n;
}
function notifyRole(role,t,d,meta={}){
  if(!DEMO_MODE)return null;
  if(meta.type&&meta.orderId&&S.notifs.some(n=>n.for===role&&n.type===meta.type&&n.orderId===meta.orderId))return null;
  const n=Object.assign({id:uid(),for:role,t,d,ts:Date.now(),read:false},meta);
  S.notifs.unshift(n);S.notifs=S.notifs.slice(0,200);Store.save();return n;
}
function notifyOrderOther(o,t,d,meta={}){
  if(!DEMO_MODE)return null;
  const u=me();if(!u||!o)return null;
  const other=u.role==='profissional'
    ?S.users.find(x=>x.role==='cliente'&&x.id===o.clientId)
    :S.users.find(x=>x.role==='profissional'&&x.proId===o.proId);
  return other?notifyUser(other.id,t,d,Object.assign({orderId:o.id,route:'/painel/pedido/'+o.id},meta)):null;
}
async function markNotifRead(id){
  const n=myNotifs().find(x=>x.id===id);if(!n)return;
  if(!DEMO_MODE){try{await marcarNotificacaoLida(id);}catch(error){toast(error.message||'Falha ao atualizar a notificacao.','err');return false;}}
  n.read=true;Store.save();
  return true;
}
async function openNotif(id){
  const n=myNotifs().find(x=>x.id===id);if(!n)return;
  if(!DEMO_MODE&&!await markNotifRead(id))return;
  n.read=true;Store.save();
  if(n.route)go(n.route);else render();
}
async function markAllNotifsRead(){
  if(!DEMO_MODE){try{await marcarTodasNotificacoesLidas();}catch(error){toast(error.message||'Falha ao atualizar as notificacoes.','err');return;}}
  myNotifs().forEach(n=>n.read=true);Store.save();render();
}
async function saveUser(patch){
  const u=me();if(!u)return false;
  const seguro={...patch};delete seguro.pass;
  if(DEMO_MODE){Object.assign(u,seguro);Store.save();return true;}
  const permitido=new Set(['name','cpf','phone','city','address','bio','service','birth','photo','notif','pixKey']);
  const invalidos=Object.keys(seguro).filter(key=>!permitido.has(key));
  if(invalidos.length)throw new Error('Este recurso ainda não está disponível para contas reais: '+invalidos.join(', '));
  if(!String(u.id).startsWith('db_'))throw new Error('A sessão persistida não foi confirmada pelo servidor.');
  const server={nome:seguro.name??u.name,cpf:seguro.cpf??u.cpf,telefone:seguro.phone??u.phone,cidade:seguro.city??u.city,endereco:seguro.address??u.address,bio:seguro.bio??u.bio,service:seguro.service??u.service,birth:seguro.birth??u.birth};
  const profile=await fetch(API_BASE_URL+'/api/auth/perfil',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(server)});
  if(!profile.ok)throw new Error('Não foi possível salvar o perfil no servidor (HTTP '+profile.status+').');
  const extras={profile:{photo:seguro.photo??u.photo,notif:seguro.notif??u.notif,pixKey:seguro.pixKey??u.pixKey}};
  const extraResponse=await fetch(API_BASE_URL+'/api/auth/dados',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({dados:extras})});
  if(!extraResponse.ok)throw new Error('Perfil salvo, mas as preferências não foram confirmadas pelo servidor.');
  Object.assign(u,seguro);Store.save();
  if(u.role==='profissional'&&seguro.service)await carregarProfissionaisPersistidos();
  return true;
}

/* ---------- TEMA ---------- */
function applyTheme(t){document.documentElement.setAttribute('data-theme',t);}
applyTheme('dark');
function toggleTheme(){const cur=document.documentElement.getAttribute('data-theme');applyTheme(cur==='dark'?'light':'dark');render();}

