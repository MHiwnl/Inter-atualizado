/* ---------- PLANO ---------- */
function dashPlano(){
  if(!DEMO_MODE)return dashHead('Meu plano','Assinaturas ainda não estão disponíveis para contas reais.')+
    '<div class="card emptystate">'+ic('wallet')+'Nenhum plano ou cobrança foi ativado. Os pagamentos estão desabilitados neste ambiente.</div>';
  const u=me(),plus=u.plan==='plus';
  return dashHead('Meu plano',plus?'Você é TaskGO Plus. Aproveite todos os benefícios.':'Desbloqueie taxas menores e saques instantâneos.')+
  '<div class="card" style="'+(plus?'border-color:var(--brand);background:linear-gradient(135deg,color-mix(in srgb,var(--brand) 14%,var(--surface)),var(--surface))':'')+'">'+
  '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px">'+
  '<div style="display:flex;gap:14px;align-items:center"><div class="ico-box">'+ic('crown')+'</div>'+
  '<div><b style="font-size:1.1rem">'+(plus?'TaskGO Plus':'Plano Gratuito')+'</b>'+
  '<p class="muted" style="font-size:.88rem">'+(plus?'Renova em '+new Date(Date.now()+18*864e5).toLocaleDateString('pt-BR')+' · R$ 29,90/mês':'Taxa de 12% por serviço concluído')+'</p></div></div>'+
  (plus?'<button class="btn btn-ghost" onclick="saveUser({plan:\'free\'});toast(\'Assinatura cancelada\');render()">Cancelar assinatura</button>'
       :'<button class="btn btn-grad" onclick="assinar(\'TaskGO Plus\')">Assinar Plus</button>')+'</div></div>'+
  '<div class="grid g2" style="margin-top:22px">'+
  [['Taxa por serviço',plus?'8%':'12%',plus],['Saque PIX',plus?'Instantâneo e grátis':'Até 30 min · R$ 1,99',plus],
   ['Prioridade nos pedidos',plus?'Ativa':'Padrão',plus],['Suporte',plus?'Prioritário 24/7':'Comercial',plus],
   ['Selo de destaque',plus?'Ativo':'Indisponível',plus],['Relatórios avançados',plus?'Liberados':'Indisponível',plus]]
  .map(x=>'<div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:14px">'+
  '<span style="font-size:.92rem;font-weight:600">'+x[0]+'</span><span class="tag '+(x[2]?'tag-ok':'tag-muted')+'">'+x[1]+'</span></div>').join('')+'</div>'+
  (!plus?'<div class="card" style="margin-top:22px;text-align:center"><h3>Economize com o Plus</h3>'+
  '<p class="muted" style="margin:10px auto 18px;max-width:460px;font-size:.92rem">Com um faturamento de R$ 4.000/mês, a taxa reduzida devolve cerca de <b style="color:var(--accent)">R$ 160</b> ao seu bolso — mais de 5x o valor da assinatura.</p>'+
  '<button class="btn btn-grad btn-lg" onclick="assinar(\'TaskGO Plus\')">Assinar por R$ 29,90/mês</button></div>':'');
}

