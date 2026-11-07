/* ---------- MENSAGENS ---------- */
let chatAtivo='';
function chatPeer(ch){
  const o=S.orders.find(x=>x.id===ch.orderId);
  return o?counterpart(o):{name:'TaskGO',rating:5};
}
function myChats(){const existing=new Map(S.chats.map(c=>[String(c.orderId),c]));return myOrders().filter(o=>!['aguardando','cancelado'].includes(o.status)).map(o=>existing.get(String(o.id))||{id:String(o.id),orderId:String(o.id),msgs:[]});}
function dashMensagens(){
  const isPro=me().role==='profissional',list=myChats();
  const c=list.find(x=>x.id===chatAtivo)||list[0];
  if(!c)return dashHead('Mensagens','')+'<div class="card emptystate">'+ic('chat')+'Nenhuma conversa ainda</div>';
  chatAtivo=c.id;
  const p=chatPeer(c);
  return dashHead('Mensagens',isPro?'Converse com os clientes dos seus atendimentos.':'Converse com os profissionais dos seus pedidos.')+
  '<div class="grid g2" style="grid-template-columns:.7fr 1.3fr;align-items:start">'+
  '<div class="card" style="padding-top:0">'+list.map(ch=>{
    const pp=chatPeer(ch),last=ch.msgs[ch.msgs.length-1]||{t:'Conversa iniciada após a confirmação do pedido.'},oo=S.orders.find(x=>x.id===ch.orderId);
    return '<div class="rowitem" role="button" tabindex="0" data-fk="chat-'+ch.id+'" aria-current="'+(ch.id===chatAtivo)+'" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();this.click()}" style="cursor:pointer;'+(ch.id===chatAtivo?'background:var(--surface-2);padding-inline:10px':'')+'" onclick="chatAtivo=\''+ch.id+'\';render()">'+avatar({name:pp.name},40)+
    '<div class="grow"><b>'+esc(pp.name)+'</b><small style="display:block">'+esc(last.t)+'</small></div>'+
    (oo?'<span class="tag tag-muted">'+svc(oo.service).n.split(' ')[0]+'</span>':'')+'</div>';
  }).join('')+'</div>'+
  '<div class="card"><div style="display:flex;align-items:center;gap:12px;padding-bottom:16px;border-bottom:1px solid var(--line);margin-bottom:16px">'+
  avatar({name:p.name},44)+'<div style="flex:1"><b style="display:block">'+esc(p.name)+'</b><span class="muted" style="font-size:.8rem">Conversa vinculada ao pedido</span></div>'+ 
  '<a class="btn btn-ghost btn-sm" href="#/painel/pedido/'+c.orderId+'">Ver pedido</a></div>'+
  '<div class="chat" id="chatBox">'+(c.msgs.length?c.msgs.map(m=>'<div class="msg '+(m.me?'me':'them')+'">'+(m.automatic?'<small>Resposta automática</small>':'')+esc(m.t)+'<small>'+new Date(m.ts).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})+(m.me&&m.readAt?' · Lida':'')+'</small></div>').join(''):'<p class="hint center">Ainda não há mensagens nesta conversa.</p>')+'</div>'+ 
  '<form style="display:flex;gap:10px;margin-top:16px" onsubmit="enviarMsg(event)">'+
    '<input class="input" id="msgIn" aria-label="Mensagem" placeholder="Escreva uma mensagem..." autocomplete="off">'+
  '<button class="btn btn-primary" aria-label="Enviar mensagem">'+ic('arrow')+'</button></form></div></div>';
}
async function enviarMsg(e){
  e.preventDefault();
  const input=$('#msgIn'),text=(input||{}).value.trim();if(!text)return;
  const chat=myChats().find(item=>String(item.id)===String(chatAtivo));if(!chat)return;
  const requestId=input.dataset.requestId||(input.dataset.requestId=crypto.randomUUID());
  if(input)input.disabled=true;
  try{
    const sent=await enviarMensagemPedido(chat.orderId,text,requestId);
    chat.msgs.push(sent);
    const index=S.chats.findIndex(item=>String(item.orderId)===String(chat.orderId));
    if(index<0)S.chats.push(chat);else S.chats[index]=chat;
    if(input)delete input.dataset.requestId;render();
  }catch(error){toast(error.message||'Não foi possível enviar a mensagem.','err');if(input)input.disabled=false;}
}

