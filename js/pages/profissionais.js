/* ---------- PARA PROFISSIONAIS ---------- */
function pageProfissionais(){
  const firstService=SERVICES[0],initialServicesPerWeek=10,initialTicket=Math.max(firstService.min,Math.min(firstService.max,225));
  const simulador=DEMO_MODE
    ?'<div><h2 class="bloco-titulo">simulador demonstrativo</h2><p class="muted sim-nota">Valores fictícios de demonstração; não representam tarifa, pedidos ou ganhos reais.</p>'+
      '<div class="field"><label for="simSvc">Categoria principal</label><select class="select" id="simSvc" onchange="simular()">'+SERVICES.map(s=>'<option value="'+s.id+'">'+s.n+'</option>').join('')+'</select></div>'+
      '<div class="field"><label for="simQtd">Serviços por semana: <b id="simQtdL">'+initialServicesPerWeek+'</b></label><input class="sim-range" type="range" id="simQtd" min="1" max="30" value="'+initialServicesPerWeek+'" oninput="simular()" aria-label="Quantidade de serviços por semana"></div>'+
      '<div class="field"><label for="simTk">Valor médio por serviço (fictício): <b id="simTkL"></b></label><input class="sim-range" type="range" id="simTk" data-service-id="'+firstService.id+'" min="'+firstService.min+'" max="'+firstService.max+'" step="5" value="'+initialTicket+'" oninput="simular()" aria-label="Valor médio fictício por serviço"><small class="sim-help" id="simTicketHint"></small></div>'+
      '<div id="simOut"></div></div>'
    :'<div><h2 class="bloco-titulo">ainda não dá para estimar ganhos</h2><p class="t2" style="font-size:.92rem">Sem pedidos e sem taxas definidas, não é possível calcular quanto você ganharia. A estimativa aparece quando houver dados reais.</p>'+
      '<h3 class="bloco-titulo" style="margin-top:32px">o que você pode fazer agora</h3><ul class="proximos">'+[['#/como-funciona','Ver o que já funciona'],['#/contato','Contar como você trabalha']].map(l=>'<li><a href="'+l[0]+'">'+l[1]+ic('arrow')+'</a></li>').join('')+'</ul></div>';
  return folha('para profissionais','<div class="duas-colunas"><div>'+duo('ajude a construir uma plataforma','feita para profissionais autônomos',1)+
  '<p class="corpo">A TaskGO está em desenvolvimento. Crie sua conta para conhecer o painel e nos ajudar a definir como a plataforma vai funcionar.</p>'+
  '<p class="aviso-linha" style="margin-top:24px"><b>Hoje nenhum cliente consegue enviar um pedido, porque o pagamento ainda não existe. Criar conta agora serve para conhecer o painel, não para receber trabalho.</b></p>'+
  '<ul class="estado-lista">'+[
    ['ok','Cadastro gratuito'],
    ['espera','Você vai escolher os pedidos que aceita, e o endereço do cliente só vai aparecer depois do aceite'],
    ['plan','Taxas e planos ainda em definição'],
    ['plan','Recebimento e saque pela plataforma'],
    ['plan','Suporte e mediação em caso de conflito']
  ].map(t=>'<li>'+statusTag(t[0])+'<span>'+t[1]+'</span></li>').join('')+'</ul>'+
  '<div class="setas">'+linkSeta('#/entrar?tipo=profissional','Criar conta de profissional',1)+'</div></div>'+simulador+'</div>','cabeca')+
  folha('recursos','<h2 class="bloco-titulo">o que existe para você</h2><div class="recursos">'+
  [['Pedidos no painel','Os pedidos da sua categoria vão aparecer no painel, com aviso dentro do app. Avisos por e-mail, push ou SMS ainda não existem.','espera'],
   ['Carteira','Saldo, extrato e saque estão em desenvolvimento. Hoje a carteira não recebe dinheiro real.','plan'],
   ['Avaliações','Os clientes vão avaliar cada atendimento concluído. Usar a nota para ordenar as buscas ainda está planejado.','espera'],
   ['Agenda','Bloquear horários e organizar a semana ainda está em desenvolvimento.','plan'],
   ['Código de chegada','O cliente vai confirmar um código de 4 dígitos para iniciar o serviço. Registro de rota e suporte de emergência ainda não existem.','espera'],
   ['Desempenho','Indicadores de aceite e faturamento ainda estão em desenvolvimento.','plan']
  ].map(f=>'<div class="recurso"><div class="recurso-topo"><h3>'+f[0]+'</h3>'+statusTag(f[2])+'</div><p>'+f[1]+'</p></div>').join('')+'</div>','folha-densa');
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

