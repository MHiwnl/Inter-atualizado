/* ---------- PARA PROFISSIONAIS ---------- */
function pageProfissionais(){
  const firstService=SERVICES[0],initialServicesPerWeek=10,initialTicket=Math.max(firstService.min,Math.min(firstService.max,225));
  const simulador=DEMO_MODE
    ?'<div class="card"><h3>Simulador demonstrativo</h3><p class="muted lp-sim-note">Valores fictícios de demonstração; não representam tarifa, pedidos ou ganhos reais.</p>'+ 
      '<div class="field"><label for="simSvc">Categoria principal</label><select class="select" id="simSvc" onchange="simular()">'+SERVICES.map(s=>'<option value="'+s.id+'">'+s.n+'</option>').join('')+'</select></div>'+ 
      '<div class="field"><label for="simQtd">Serviços por semana: <b id="simQtdL">'+initialServicesPerWeek+'</b></label><input class="sim-range" type="range" id="simQtd" min="1" max="30" value="'+initialServicesPerWeek+'" oninput="simular()" aria-label="Quantidade de serviços por semana"></div>'+ 
      '<div class="field"><label for="simTk">Ticket demonstrativo por serviço: <b id="simTkL"></b></label><input class="sim-range" type="range" id="simTk" data-service-id="'+firstService.id+'" min="'+firstService.min+'" max="'+firstService.max+'" step="5" value="'+initialTicket+'" oninput="simular()" aria-label="Ticket fictício por serviço"><small class="sim-help" id="simTicketHint"></small></div>'+ 
      '<div id="simOut"></div></div>'
    :'<div class="card"><h3>Estimativa indisponível</h3><p class="muted">O TaskGO ainda não tem tarifas, volume de pedidos ou pagamentos persistidos para calcular ganhos.</p></div>';
  return '<section class="section"><div class="wrap"><div class="split lp-panel">'+
  '<div class="lp-copy"><span class="eyebrow">'+ic('award')+' Para profissionais</span>'+
  '<h2>Transforme sua habilidade em renda recorrente</h2>'+
  '<p class="t2">Cadastre-se grátis, receba pedidos na sua região e seja pago via PIX. Sem mensalidade, sem exclusividade, você define a agenda.</p>'+
  '<ul class="list-check">'+[
    'Zero mensalidade no plano gratuito — pague só uma taxa por serviço concluído',
    'Carteira e saques ainda indisponíveis nesta versão',
    'Complete seu perfil para apresentar sua experiencia aos clientes',
    'Você aceita apenas os pedidos que fizerem sentido para você',
    'Suporte humano e mediação em caso de conflitos'
  ].map(t=>'<li>'+ic('checkCircle')+'<span>'+t+'</span></li>').join('')+'</ul>'+
  '<div class="lp-actions lp-actions-start"><a class="btn btn-grad btn-lg" href="#/entrar?tipo=profissional">Criar conta de profissional '+ic('arrow')+'</a></div></div>'+
  simulador+
  '</div>'+
  '<div class="grid g3 lp-after-panel">'+
  [['bell','Pedidos no seu bolso','Notificação instantânea dos pedidos compatíveis com seu perfil e raio de atendimento.'],
   ['wallet','Carteira transparente','Veja o que entrou, o que está retido e o que já pode ser sacado — tudo em tempo real.'],
   ['star','Reputação que vale','Cada avaliação positiva melhora seu posicionamento nas buscas da plataforma.'],
   ['cal','Agenda sob controle','Bloqueie horários, defina dias de folga e organize seus atendimentos.'],
   ['shield','Proteção nos atendimentos','Código de chegada, registro de rota e suporte de emergência durante o serviço.'],
   ['trendUp','Painel de desempenho','Acompanhe taxa de aceite, conversão, faturamento e avaliação média.']
  ].map(f=>'<div class="card card-hover lp-feature"><div class="ico-box">'+ic(f[0])+'</div><h3>'+f[1]+'</h3><p>'+f[2]+'</p></div>').join('')+'</div>'+
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
    '<p class="sim-result-context">Com cerca de '+Math.round(servicesPerMonth)+' serviços de '+service.n+' por mês e ticket médio de '+money(t)+'.</p>'+
    '<div class="sim-result-row"><span>Faturamento bruto</span><b>'+money(bruto)+'</b></div>'+
    '<div class="sim-result-row"><span>Taxa TaskGO (12%)</span><b class="sim-fee">- '+money(taxa)+'</b></div>'+
    '<div class="sim-result-range">Faixa de referência líquida, com o mesmo volume: <b>'+money(low)+' a '+money(high)+'</b>.</div></div>'+
    '<p class="hint" style="margin-top:12px">Cálculo com 4,33 semanas por mês e taxa de 12%. A faixa usa os valores de referência da categoria; é uma estimativa, não uma garantia de pedidos.</p>';
}

