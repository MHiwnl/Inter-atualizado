/* ---------- PLANOS ---------- */
function pagePlanos(){
  if(!DEMO_MODE)return folha('planos',duo('planos','indisponíveis',1)+
    '<p class="corpo">Os valores e as condições dos planos ainda estão em definição. Hoje nenhuma cobrança é feita pela plataforma.</p>'+
    '<p class="corpo">A assinatura TaskGO Plus ainda não está disponível: o pagamento pela plataforma não existe, então nenhuma assinatura pode ser ativada.</p>'+
    '<p class="corpo">É profissional? Conte o que faria sentido pagar, e de que forma. Isso ajuda a definir os planos.</p>'+
    '<div class="setas">'+linkSeta('#/contato','Opinar sobre os planos',1)+linkSeta('#/como-funciona','Ver o que já funciona')+'</div>','cabeca');
  const planos=[
    {n:'Gratuito',p:'R$ 0',s:'/mês',d:'Para quem está começando',pop:false,f:['Pedidos ilimitados','Estimativa por IA','Localização compartilhada quando disponível','Código de chegada','Saque PIX em até 30 min','Taxa de 12% por serviço'],cta:'Começar grátis'},
    {n:'TaskGO Plus',p:'R$ 29,90',s:'/mês',d:'Para profissionais que vivem disso',pop:true,f:['Tudo do Gratuito','Taxa reduzida para 8%','Saque PIX instantâneo e sem taxa','Selo Plus em destaque na busca','Prioridade no envio de pedidos','Suporte prioritário 24/7','Relatórios de desempenho avançados'],cta:'Assinar Plus'},
    {n:'Empresas',p:'Sob consulta',s:'',d:'Condomínios, imobiliárias e franquias',pop:false,f:['Múltiplos usuários e centros de custo','Faturamento mensal consolidado','SLA de atendimento garantido','Gestor de conta dedicado','Integração via API','Relatórios personalizados'],cta:'Falar com vendas'}
  ];
  return folha('planos',duo('escolha o','plano ideal',1)+'<p class="corpo">Modo demonstração: valores e benefícios são fictícios e não estão confirmados.</p>','cabeca')+
  folha('exemplo','<div class="grid g3">'+planos.map(p=>'<div class="plan '+(p.pop?'pop':'')+'">'+(p.pop?'<span class="badge-pop">Exemplo</span>':'')+
  '<h2 class="sub">'+p.n+'</h2><div class="price">'+p.p+'<small>'+p.s+'</small></div>'+
  '<span class="t2" style="font-size:.86rem">'+p.d+'</span>'+
  '<ul>'+p.f.map(f=>'<li>'+ic('check')+'<span>'+f+'</span></li>').join('')+'</ul>'+
  '<button class="btn '+(p.pop?'btn-primary':'btn-ghost')+' btn-block" onclick="assinar(\''+p.n+'\')">'+p.cta+'</button></div>').join('')+'</div>'+
  '<div class="faq-lista mt-grande">'+faqList([FAQ[3],FAQ[5],FAQ[6]])+'</div>','folha-densa');
}
function assinar(n){
  if(n==='Empresas')return go('/contato');
  if(!me())return go('/entrar');
  openModal('<div class="modal-head"><div><h3>Assinar '+esc(n)+'</h3><p>Confirme a assinatura para ativar os benefícios imediatamente.</p></div><button class="icon-btn" aria-label="Fechar" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="card" style="background:var(--surface-2);margin-bottom:18px"><div style="display:flex;justify-content:space-between"><span>'+esc(n)+'</span><b>R$ 29,90/mês</b></div>'+
  '<p class="hint" style="margin-top:8px">Cobrança mensal recorrente. Cancele quando quiser, sem multa.</p></div>'+
  '<button class="btn btn-grad btn-block" onclick="confirmarPlano()">'+ic('pix')+' Pagar com PIX</button>');
}
function confirmarPlano(){toast('A assinatura ainda não está disponível: o pagamento pela plataforma não existe.','err');}

