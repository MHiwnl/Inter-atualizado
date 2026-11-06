/* ---------- PARA PROFISSIONAIS ---------- */
function pageProfissionais(){
  const firstService=SERVICES[0],initialServicesPerWeek=10,initialTicket=Math.max(firstService.min,Math.min(firstService.max,225));
  const simulador=DEMO_MODE
    ?'<div class="card"><h2 class="lp-card-title">Simulador demonstrativo</h2><p class="muted lp-sim-note">Valores fictícios de demonstração; não representam tarifa, pedidos ou ganhos reais.</p>'+ 
      '<div class="field"><label for="simSvc">Categoria principal</label><select class="select" id="simSvc" onchange="simular()">'+SERVICES.map(s=>'<option value="'+s.id+'">'+s.n+'</option>').join('')+'</select></div>'+ 
      '<div class="field"><label for="simQtd">Serviços por semana: <b id="simQtdL">'+initialServicesPerWeek+'</b></label><input class="sim-range" type="range" id="simQtd" min="1" max="30" value="'+initialServicesPerWeek+'" oninput="simular()" aria-label="Quantidade de serviços por semana"></div>'+ 
      '<div class="field"><label for="simTk">Valor médio por serviço (fictício): <b id="simTkL"></b></label><input class="sim-range" type="range" id="simTk" data-service-id="'+firstService.id+'" min="'+firstService.min+'" max="'+firstService.max+'" step="5" value="'+initialTicket+'" oninput="simular()" aria-label="Valor médio fictício por serviço"><small class="sim-help" id="simTicketHint"></small></div>'+ 
      '<div id="simOut"></div></div>'
    :'<div class="card"><h2 class="lp-card-title">Ainda não dá para estimar ganhos</h2><p class="muted">Sem pedidos e sem taxas definidas, não é possível calcular quanto você ganharia. A estimativa aparece quando houver dados reais.</p>'+
      '<h3 class="lp-next-title">O que você pode fazer agora</h3><ul class="lp-next">'+[['#/entrar?tipo=profissional','Criar sua conta de profissional'],['#/como-funciona','Ver o que já funciona'],['#/contato','Contar como você trabalha']].map(l=>'<li><a href="'+l[0]+'">'+l[1]+ic('arrow')+'</a></li>').join('')+'</ul></div>';
  return '<section class="section"><div class="wrap"><div class="split lp-panel">'+
  '<div class="lp-copy"><span class="eyebrow">'+ic('award')+' Para profissionais</span>'+
  '<h1 class="lp-page-title">Ajude a construir uma plataforma feita para profissionais autônomos</h1>'+
  '<p class="t2">A TaskGO está em desenvolvimento, e ainda não há pedidos de clientes. Você já pode criar sua conta, conhecer o painel e nos ajudar a definir como a plataforma vai funcionar.</p>'+
  '<ul class="lp-status-list">'+[
    ['ok','Cadastro gratuito'],
    ['parcial','Você escolhe os pedidos que aceita, e o endereço do cliente só aparece depois do aceite'],
    ['plan','Taxas e planos ainda em definição'],
    ['plan','Recebimento e saque pela plataforma'],
    ['plan','Suporte e mediação em caso de conflito']
  ].map(t=>'<li>'+statusTag(t[0])+'<span>'+t[1]+'</span></li>').join('')+'</ul>'+
  '<div class="lp-actions lp-actions-start"><a class="btn btn-grad btn-lg" href="#/entrar?tipo=profissional">Criar conta de profissional '+ic('arrow')+'</a></div></div>'+
  simulador+
  '</div>'+
  '<div class="grid g3 lp-after-panel">'+
  [['bell','Pedidos no painel','Os pedidos da sua categoria aparecem no painel, com aviso dentro do app. Avisos por e-mail, push ou SMS ainda não existem.','parcial'],
   ['wallet','Carteira','Saldo, extrato e saque estão em desenvolvimento. Hoje a carteira não recebe dinheiro real.','plan'],
   ['star','Avaliações','Os clientes avaliam cada atendimento concluído. Usar a nota para ordenar as buscas ainda está planejado.','parcial'],
   ['cal','Agenda','Bloquear horários e organizar a semana ainda está em desenvolvimento.','plan'],
   ['shield','Código de chegada','O cliente confirma um código de 4 dígitos para iniciar o serviço. Registro de rota e suporte de emergência ainda não existem.','parcial'],
   ['trendUp','Desempenho','Indicadores de aceite e faturamento ainda estão em desenvolvimento.','plan']
  ].map(f=>'<div class="card card-hover lp-feature"><div class="lp-feature-top"><div class="ico-box">'+ic(f[0])+'</div>'+statusTag(f[3])+'</div><h2 class="lp-card-title">'+f[1]+'</h2><p>'+f[2]+'</p></div>').join('')+'</div>'+
  '</div></section>';
}
function simular(){
  const select=$('#simSvc'),quantity=$('#simQtd'),ticket=$('#simTk'),output=$('#simOut');
  if(!select||!quantity||!ticket||!output)return;
  const service=svc(select.value),min=Number(service.min),max=Number(service.max),step=5;
  ticket.min=min;ticket.max=max;ticket.step=step;
  if(ticket.dataset.serviceId!==service.id){
    ticket.dataset.serviceId=service.id;
    ticket.value=Math.max(min,Math.min(max,Math.round(((min+max)/2)/step)*step));
  }
  const q=Math.max(1,Math.min(30,Number(quantity.value)||1));
  const t=Math.max(min,Math.min(max,Number(ticket.value)||min));
  quantity.value=q;ticket.value=t;
  $('#simQtdL').textContent=q;
  $('#simTkL').textContent=money(t);
  $('#simTicketHint').textContent='Referência para '+service.n+': '+money(min)+' a '+money(max)+' por '+service.unit+'.';
  quantity.style.setProperty('--range-progress',((q-1)/(Number(quantity.max)-1)*100)+'%');
  ticket.style.setProperty('--range-progress',((t-min)/(max-min||1)*100)+'%');

  const weeksPerMonth=4.33,feeRate=.12,servicesPerMonth=q*weeksPerMonth;
  const bruto=servicesPerMonth*t,taxa=bruto*feeRate,liq=bruto-taxa;
  const low=servicesPerMonth*min*(1-feeRate),high=servicesPerMonth*max*(1-feeRate);
  output.innerHTML='<div class="sim-results">'+
    '<div class="sim-result-highlight"><span>Líquido estimado/mês</span><b>'+money(liq)+'</b></div>'+
    '<p class="sim-result-context">Com cerca de '+Math.round(servicesPerMonth)+' serviços de '+service.n+' por mês e valor médio de '+money(t)+'.</p>'+
    '<div class="sim-result-row"><span>Faturamento bruto</span><b>'+money(bruto)+'</b></div>'+
    '<div class="sim-result-row"><span>Taxa TaskGO (12%)</span><b class="sim-fee">- '+money(taxa)+'</b></div>'+
    '<div class="sim-result-range">Faixa de referência líquida, com o mesmo volume: <b>'+money(low)+' a '+money(high)+'</b>.</div></div>'+
    '<p class="hint" style="margin-top:12px">Cálculo com 4,33 semanas por mês e taxa de 12%. A faixa usa os valores de referência da categoria; é uma estimativa, não uma garantia de pedidos.</p>';
}

