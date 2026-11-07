/* ---------- DESEMPENHO ---------- */
function dashDesempenho(){
  if(!DEMO_MODE)return dashHead('Desempenho','Indicadores de aceite e faturamento ainda estão em desenvolvimento.')+
    '<div class="card emptystate">'+ic('trendUp')+'<b>Ainda não há indicadores</b><p style="margin-top:6px">Quando houver atendimentos reais, seus resultados aparecerão aqui.</p>'+
    '<a class="btn btn-primary" style="margin-top:16px" href="#/app/oportunidades">Ver oportunidades</a></div>';
  const meses=['Abr','Mai','Jun','Jul','Ago','Set'],vals=[2140,2680,2310,3120,3580,4240];
  const maxv=Math.max.apply(null,vals);
  return dashHead('Desempenho demonstrativo','Valores fictícios do modo demonstração.')+
  '<div class="grid g4" style="margin-bottom:22px">'+
  [['Faturamento do mês',money(4240),'+18,4%','var(--accent)'],['Taxa de aceite','86%','+4 p.p.','var(--brand)'],
   ['Conversão em fechamento','71%','+2 p.p.','var(--brand)'],['Avaliação média','4,9 de 5','estável','var(--warn)']]
  .map(s=>'<div class="stat"><div class="lbl">'+s[0]+'</div><div class="val">'+s[1]+'</div><div class="delta" >'+s[2]+'</div></div>').join('')+'</div>'+
  '<div class="grid g2" style="grid-template-columns:1.4fr .6fr;align-items:start">'+
  '<div class="card"><h2 class="sub" style="font-size:1.05rem;margin-bottom:22px">Faturamento nos últimos 6 meses</h2>'+
  '<div style="display:flex;align-items:flex-end;gap:14px;height:210px">'+
  vals.map((v,i)=>'<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;justify-content:flex-end">'+
  '<b style="font-size:.76rem">'+(v/1000).toFixed(1)+'k</b>'+
  '<div style="width:100%;height:'+(v/maxv*100)+'%;background:var(--brand);min-height:8px"></div>'+
  '<span class="muted" style="font-size:.76rem">'+meses[i]+'</span></div>').join('')+'</div></div>'+
  '<div class="card"><h2 class="sub" style="font-size:1rem;margin-bottom:16px">Serviços mais pedidos</h2>'+
  [['Instalação elétrica',42],['Manutenção de quadro',27],['Troca de chuveiro',18],['Automação',13]]
  .map(x=>'<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:.86rem;margin-bottom:6px"><span>'+x[0]+'</span><b>'+x[1]+'%</b></div>'+
  '<div class="bar"><i style="width:'+x[1]+'%"></i></div></div>').join('')+
  '</div></div>';
}

