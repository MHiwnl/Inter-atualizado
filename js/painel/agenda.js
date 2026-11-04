/* ---------- AGENDA ---------- */
let agendaDia=0;
const AGENDA_DEMO=[
  [0,'09:00','Instalação de split — Ana Beatriz','Boa Viagem','confirmado',320],
  [0,'14:30','Manutenção elétrica — Condomínio Aurora','Pina','confirmado',480],
  [1,'08:00','Troca de disjuntores — Roberto Farias','Espinheiro','pendente',260],
  [1,'15:00','Orçamento — Reforma elétrica','Casa Forte','pendente',0],
  [2,'10:00','Higienização de 3 splits — Escritório Meta','Ilha do Leite','confirmado',540],
  [3,'09:30','Instalação de tomadas — Fernanda Lopes','Boa Viagem','confirmado',190],
  [4,'16:00','Revisão de quadro — Padaria São José','Graças','pendente',420],
  [5,'11:00','Manutenção preventiva — Studio Vitória','Olinda','confirmado',300],
  [6,'08:30','Instalação de CFTV — Clínica Vida','Espinheiro','confirmado',860]
];
function agendaEventos(){
  const hoje=new Date();hoje.setHours(0,0,0,0);
  const evts=AGENDA_DEMO.map(e=>({d:e[0],h:e[1],t:e[2],b:e[3],st:e[4],v:e[5],id:null}));
  myOrders().forEach(o=>{
    if(!o.sched)return;
    const di=Math.floor((o.sched-hoje.getTime())/864e5);
    if(di<0||di>6)return;
    evts.push({d:di,h:new Date(o.sched).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),
      t:svc(o.service).n+' — '+counterpart(o).name,
      b:(String(o.address||'').split('—')[1]||o.address||'').split(',')[0].trim(),
      st:o.status==='agendado'?'confirmado':'pendente',v:o.price,id:o.id});
  });
  return evts.sort((a,b)=>a.h.localeCompare(b.h));
}
function dashAgenda(){
  const hoje=new Date();hoje.setHours(0,0,0,0);
  const dias=Array.from({length:7},(_,i)=>new Date(hoje.getTime()+i*864e5));
  const evts=agendaEventos();
  const doDia=evts.filter(e=>e.d===agendaDia);
  const sel=dias[agendaDia];
  const total=doDia.reduce((a,b)=>a+(b.v||0),0);
  return dashHead('Agenda','Toque em um dia para ver os atendimentos.','<button class="btn btn-ghost" onclick="bloquearHorario()">'+ic('plus')+' Bloquear horário</button>')+
  '<div class="scroll-x" style="margin-bottom:22px"><div class="grid" style="grid-template-columns:repeat(7,minmax(78px,1fr));gap:10px;min-width:580px">'+
  dias.map((d,i)=>{const q=evts.filter(e=>e.d===i).length;
    return '<div class="card center dia '+(i===agendaDia?'sel':'')+'" style="padding:14px 8px" onclick="agendaDia='+i+';render()">'+
    '<span class="muted" style="font-size:.72rem;text-transform:uppercase">'+(i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','').toUpperCase())+'</span>'+
    '<div style="font-size:1.3rem;font-weight:800;margin:4px 0">'+d.getDate()+'</div>'+
    '<span class="tag '+(q?'tag-info':'tag-muted')+'">'+q+'</span></div>';}).join('')+'</div></div>'+
  '<div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:14px">'+
  '<h3 style="font-size:1.05rem;text-transform:capitalize">'+sel.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})+'</h3>'+
  (doDia.length?'<span class="pill">'+ic('wallet')+' Previsto: '+money(total)+' · '+doDia.length+' atendimento'+(doDia.length>1?'s':'')+'</span>':'')+'</div>'+
  (doDia.length?doDia.map(e=>'<div class="rowitem"'+(e.id?' style="cursor:pointer" onclick="go(\'/painel/pedido/'+e.id+'\')"':'')+'>'+
  '<div style="text-align:center;flex:none;width:58px"><b style="font-size:.95rem">'+e.h+'</b>'+
  '<small class="muted" style="display:block">'+sel.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})+'</small></div>'+
  '<div class="grow" style="border-left:1px solid var(--line);padding-left:14px"><b>'+esc(e.t)+'</b><small>'+ic('mapPin')+' '+esc(e.b||'—')+(e.v?' · '+money(e.v):'')+'</small></div>'+
  '<span class="tag '+(e.st==='confirmado'?'tag-ok':'tag-warn')+'">'+e.st+'</span></div>').join('')
  :'<div class="card emptystate">'+ic('cal')+'<b>Nenhum atendimento neste dia</b><p style="margin-top:6px">Dia livre. Você pode ficar disponível para receber novos pedidos.</p>'+
   '<a class="btn btn-primary" style="margin-top:16px" href="#/painel/oportunidades">Ver oportunidades</a></div>');
}
function bloquearHorario(){
  openModal('<div class="modal-head"><div><h3>Bloquear horário</h3><p>Nenhum pedido será enviado nesse período.</p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="field"><label>Data</label><input class="input" type="date"></div>'+
  '<div class="grid g2" style="gap:0 14px"><div class="field"><label>Das</label><input class="input" type="time" value="12:00"></div>'+
  '<div class="field"><label>Até</label><input class="input" type="time" value="13:00"></div></div>'+
  '<div class="field"><label>Motivo (opcional)</label><input class="input" placeholder="Almoço, consulta, folga..."></div>'+
  '<button class="btn btn-grad btn-block" onclick="closeModal();toast(\'Horário bloqueado na sua agenda\',\'ok\')">Bloquear</button>');
}

