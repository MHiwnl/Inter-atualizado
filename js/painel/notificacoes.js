/* ---------- NOTIFICACOES ---------- */
function dashNotificacoes(){
  if(!DEMO_MODE&&window.__taskgoNotificationsError)return dashHead('Notifica\u00e7\u00f5es','')+'<div class="card center"><p class="muted">N\u00e3o foi poss\u00edvel carregar o hist\u00f3rico do servidor.</p><button class="btn btn-ghost" onclick="window.__taskgoNotificationsLoaded=false;window.__taskgoNotificationsError=\'\';render()">Tentar novamente</button></div>';
  const list=myNotifs(),unread=list.filter(n=>!n.read).length;
  const actions=unread?'<button class="btn btn-ghost" onclick="markAllNotifsRead()">'+ic('check')+' Marcar todas como lidas ('+unread+')</button>':'';
  const rows=list.map(n=>{
    const icon=n.kind==='account'?'checkCircle':n.kind==='message'?'chat':n.kind==='payment'?'wallet':n.kind==='review'?'star':n.kind==='order'?'list':'bell';
    const key=String(n.id).replace(/[^a-zA-Z0-9_-]/g,'');
    return '<div class="rowitem" role="button" tabindex="0" onclick="openNotif(\''+key+'\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();openNotif(\''+key+'\')}" style="cursor:pointer;'+(!n.read?'border-color:color-mix(in srgb,var(--brand) 45%,var(--line));background:color-mix(in srgb,var(--brand) 5%,var(--surface))':'')+'">'+
      '<div class="ico-box" style="width:40px;height:40px;border-radius:12px;position:relative">'+ic(icon)+(!n.read?'<i style="position:absolute;width:8px;height:8px;right:-2px;top:-2px;border-radius:50%;background:var(--brand);border:2px solid var(--surface)"></i>':'')+'</div>'+ 
      '<div class="grow"><b>'+esc(n.t||'Notifica\u00e7\u00e3o')+'</b><small>'+esc(n.d||'')+'</small>'+(n.channel?'<small>Canal: '+esc(n.channel==='in_app'?'aplicativo':n.channel)+' - Estado: '+esc(n.deliveryStatus||'criada')+'</small>':'')+(n.route?'<small style="color:var(--brand);margin-top:4px">Abrir detalhes '+ic('arrow')+'</small>':'')+'</div>'+ 
      '<span class="muted" style="font-size:.78rem;white-space:nowrap">'+dt(n.ts)+'</span></div>';
  }).join('');
  const subtitle=unread?unread+' n\u00e3o lida'+(unread===1?'':'s')+' - hist\u00f3rico do aplicativo. E-mail, push e SMS n\u00e3o configurados.':'Hist\u00f3rico do aplicativo. E-mail, push e SMS n\u00e3o configurados.';
  return dashHead('Notifica\u00e7\u00f5es',subtitle,actions)+(list.length?'<div style="display:grid;gap:10px">'+rows+'</div>':'<div class="card emptystate">'+ic('bell')+'<b>Nenhuma notifica\u00e7\u00e3o por enquanto</b><p class="muted" style="margin-top:8px">Novas mensagens e eventos dos seus pedidos aparecer\u00e3o aqui.</p></div>');
}
