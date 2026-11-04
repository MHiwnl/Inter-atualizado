/* ---------- INIT ---------- */
if(!location.hash)location.hash='#/home';
route=parseHash();
async function restaurarSessaoServidor(){
  try{
    const resposta=await fetch(API_BASE_URL+'/api/auth/sessao',{credentials:'include'});
    if(!resposta.ok){if(resposta.status===401){const local=me();if(local?.id?.startsWith('db_'))S.users=S.users.filter(usuario=>usuario!==local);S.session=null;Store.save();}await carregarProfissionaisPersistidos();render();return;}
    const usuario=await resposta.json(),id='db_'+usuario.id;
    let local=S.users.find(u=>u.id===id||String(u.email||'').toLowerCase()===String(usuario.email||'').toLowerCase());
    if(!local){local={id,role:usuario.tipo,name:usuario.nome,email:usuario.email,photo:null,balance:0,pending:0,rating:0,since:Date.now(),plan:'free',notif:{push:true,email:true,promo:true,sms:false},twofa:false,paymentMethods:[],verified:false,jobs:0,acceptRadius:10};S.users.push(local);}
    S.users=[local];S.orders=[];S.tx=[];S.chats=[];S.notifs=[];
    Object.assign(local,{id,role:usuario.tipo,name:usuario.nome,email:usuario.email,cpf:usuario.cpf||'',phone:usuario.telefone||'',city:usuario.cidade||'',address:usuario.endereco||'',bio:usuario.bio||'',birth:usuario.birth||'',proId:usuario.proId,service:usuario.service,verified:false});
    S.session=id;window.__taskgoHydrating=true;Store.save();
    try{await carregarProfissionaisPersistidos();}catch(erro){console.error('Falha ao carregar profissionais cadastrados:',erro);}
    try{await syncPedidos(usuario.email);await syncDadosConta(usuario.email);await carregarNotificacoes();}catch(erro){console.error('Falha ao carregar dados da conta:',erro);}
    window.__taskgoHydrating=false;
  }catch(erro){console.warn('API de sessão indisponível:',erro);try{await carregarProfissionaisPersistidos();}catch(error){console.error('Falha ao carregar profissionais:',error);}}
  render();
}
function iniciarPollingNotificacoes(){
  if(DEMO_MODE||!me()||window.__taskgoNotificationPoll)return;
  window.__taskgoNotificationPoll=setInterval(async()=>{
    try{const before=JSON.stringify(S.notifs);await carregarNotificacoes();if(before!==JSON.stringify(S.notifs))render();}
    catch(error){console.warn('Falha ao atualizar notificacoes:',error);}
  },20000);
}
if(DEMO_MODE){const role=new URLSearchParams(location.search).get('role');S.session=role==='profissional'?'u_pro':role==='cliente'?'u_cliente':null;render();}
else restaurarSessaoServidor();
