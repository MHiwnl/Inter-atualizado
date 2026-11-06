/* ---------- SOBRE ---------- */
function pageSobre(){
  return '<section class="section"><div class="wrap">'+
  '<div class="sec-head"><span class="eyebrow">'+ic('building')+' Quem somos</span><h2>Um projeto universitário com um propósito real</h2>'+
  '<p>A TaskGO é um MVP em desenvolvimento, criado em 2026 por um grupo de estudantes da UNIBRA, em Recife.</p></div>'+
  '<div class="split" style="margin-bottom:64px">'+
  '<div><p class="t2">A proposta é aproximar pessoas que precisam de serviços locais de profissionais autônomos. Estamos transformando essa ideia em uma experiência mais simples, organizada e transparente para os dois lados.</p>'+
  '<p class="t2" style="margin-top:16px">A TaskGO ainda está em desenvolvimento: não temos clientes nem profissionais cadastrados. Esta etapa é dedicada a construir o MVP, ouvir quem poderá usar a plataforma e validar os fluxos antes de ampliar o projeto.</p>'+
  '<div class="grid g2" style="margin-top:30px">'+[
    ['Missão','Facilitar o encontro entre quem precisa de um serviço e quem pode realizá-lo, com uma jornada clara e simples.'],
    ['Visão','Evoluir uma solução útil, construída com base nas necessidades de clientes e profissionais.'],
    ['Valores','Transparência, segurança, respeito ao trabalho e escuta ativa em cada etapa.'],
    ['Foco atual','Concluir o MVP e validar a proposta com potenciais clientes e profissionais em Recife.']
  ].map(x=>'<div class="card"><b style="display:block;margin-bottom:6px">'+x[0]+'</b><span class="muted" style="font-size:.9rem">'+x[1]+'</span></div>').join('')+'</div></div>'+
  '<div class="card" style="padding:0;overflow:hidden"><div style="padding:26px"><h3 style="margin-bottom:18px">A TaskGO hoje</h3>'+
  [['Fundação do projeto','2026'],['Origem','Estudantes da UNIBRA · Recife'],['Fase atual','MVP em desenvolvimento'],['Clientes cadastrados','0'],['Profissionais cadastrados','0']]
  .map(n=>'<div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:13px 0;border-bottom:1px solid var(--line)"><span class="muted" style="font-size:.88rem">'+n[0]+'</span><b style="font-size:1rem;text-align:right">'+n[1]+'</b></div>').join('')+
  '<p class="muted" style="font-size:.78rem;margin:16px 0 0">Os dados mostram o estágio atual do projeto, antes da abertura ao público.</p>'+
  '</div></div></div>'+
  '<h3 style="margin-bottom:22px">Etapas do projeto</h3><div class="grid g4">'+
  [['2026','Projeto criado','Estudantes da UNIBRA iniciam a construção da proposta da TaskGO.'],
   ['Agora','MVP em desenvolvimento','Construção e refinamento dos primeiros fluxos da plataforma.'],
   ['Próxima etapa','Validação com usuários','Ouvir potenciais clientes e profissionais e testar a experiência.'],
   ['Depois da validação','Lançamento gradual','Abrir a plataforma ao público quando o produto estiver pronto para uso.']]
  .map(t=>'<div class="card"><span class="tag tag-info">'+t[0]+'</span><h3 style="margin:14px 0 8px;font-size:1.05rem">'+t[1]+'</h3><p class="muted" style="font-size:.88rem">'+t[2]+'</p></div>').join('')+'</div>'+
  '<h3 style="margin:60px 0 22px">Time fundador</h3><div class="grid g4">'+
  [['Joabe Junior','CEO & Cofundador'],['Arthur Mendes','CTO & Cofundador'],['Thiago Vinicius','Head de Operações'],['Vinicius Ziano','Head de Confiança & Segurança']]
  .map(p=>'<div class="card center"><div style="display:flex;justify-content:center">'+avatar({name:p[0]},64)+'</div>'+
    '<b style="display:block;margin-top:14px">'+p[0]+'</b><span class="muted" style="font-size:.84rem">'+p[1]+'</span></div>').join('')+'</div>'+
  '</div></section>';
}
