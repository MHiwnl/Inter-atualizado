/* ---------- DESEMPENHO ---------- */
function dashDesempenho(){
  const meses=['Abr','Mai','Jun','Jul','Ago','Set'],vals=[2140,2680,2310,3120,3580,4240];
  const maxv=Math.max.apply(null,vals);
  return dashHead('Desempenho','Acompanhe a evolução dos seus resultados na plataforma.')+
  '<div class="grid g4" style="margin-bottom:22px">'+
  [['Faturamento do mês',money(4240),'+18,4%','var(--accent)'],['Taxa de aceite','86%','+4 p.p.','var(--brand)'],
   ['Conversão em fechamento','71%','+2 p.p.','var(--brand)'],['Avaliação média','4,9 ★','estável','var(--warn)']]
  .map(s=>'<div class="stat"><div class="lbl">'+s[0]+'</div><div class="val">'+s[1]+'</div><div class="delta" style="color:'+s[3]+'">'+s[2]+'</div></div>').join('')+'</div>'+
  '<div class="grid g2" style="grid-template-columns:1.4fr .6fr;align-items:start">'+
  '<div class="card"><h3 style="font-size:1.05rem;margin-bottom:22px">Faturamento nos últimos 6 meses</h3>'+
  '<div style="display:flex;align-items:flex-end;gap:14px;height:210px">'+
  vals.map((v,i)=>'<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;justify-content:flex-end">'+
  '<b style="font-size:.76rem">'+(v/1000).toFixed(1)+'k</b>'+
  '<div style="width:100%;height:'+(v/maxv*100)+'%;background:var(--brand);border-radius:8px 8px 3px 3px;min-height:8px"></div>'+
  '<span class="muted" style="font-size:.76rem">'+meses[i]+'</span></div>').join('')+'</div></div>'+
  '<div class="card"><h3 style="font-size:1rem;margin-bottom:16px">Serviços mais pedidos</h3>'+
  [['Instalação elétrica',42],['Manutenção de quadro',27],['Troca de chuveiro',18],['Automação',13]]
  .map(x=>'<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:.86rem;margin-bottom:6px"><span>'+x[0]+'</span><b>'+x[1]+'%</b></div>'+
  '<div class="bar"><i style="width:'+x[1]+'%"></i></div></div>').join('')+
  '<div style="margin-top:20px;padding:14px;border-radius:12px;background:color-mix(in srgb,var(--brand) 10%,transparent);font-size:.85rem">'+
  ic('sparkle')+' <b>Dica da IA:</b> responder em menos de 5 minutos aumenta sua conversão em até 34%.</div></div></div>';
}

