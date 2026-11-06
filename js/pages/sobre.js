/* ---------- SOBRE ---------- */
function pageSobre(){
  return '<section class="section"><div class="wrap">'+
  '<div class="sec-head"><span class="eyebrow">'+ic('building')+' Quem somos</span><h1 class="lp-page-title">Um projeto universitário com um propósito real</h1>'+
  '<p>A TaskGO é um projeto em desenvolvimento, criado em 2026 por um grupo de estudantes da UNIBRA, em Recife.</p></div>'+
  '<div class="split lp-panel">'+
  '<div class="lp-copy"><p class="t2">A proposta é aproximar pessoas que precisam de serviços locais de profissionais autônomos. Estamos transformando essa ideia em uma experiência mais simples, organizada e transparente para os dois lados.</p>'+
  '<p class="t2">A TaskGO ainda está em desenvolvimento: não temos clientes nem profissionais cadastrados. Esta etapa é dedicada a construir a primeira versão, ouvir quem poderá usar a plataforma e validar os fluxos antes de ampliar o projeto.</p>'+
  '<div class="grid g2">'+[
    ['Missão','Facilitar o encontro entre quem precisa de um serviço e quem pode realizá-lo, com uma jornada clara e simples.'],
    ['Visão','Evoluir uma solução útil, construída com base nas necessidades de clientes e profissionais.'],
    ['Valores','Transparência, segurança, respeito ao trabalho e escuta ativa em cada etapa.'],
    ['Foco atual','Concluir a primeira versão e validar a proposta com potenciais clientes e profissionais em Recife.']
  ].map(x=>'<div class="card lp-feature"><h2 class="lp-card-title">'+x[0]+'</h2><p>'+x[1]+'</p></div>').join('')+'</div></div>'+
  '<div class="card lp-today"><h2 class="lp-card-title">A TaskGO hoje</h2>'+
  [['Fundação do projeto','2026'],['Origem','Estudantes da UNIBRA · Recife'],['Fase atual','Primeira versão em desenvolvimento'],['Clientes cadastrados','0'],['Profissionais cadastrados','0']]
  .map(n=>'<div class="lp-today-row"><span class="muted">'+n[0]+'</span><b>'+n[1]+'</b></div>').join('')+
  '<p class="muted lp-small">Os dados mostram o estágio atual do projeto, antes da abertura ao público.</p>'+
  '</div></div>'+
  '<h2 class="lp-subhead">Etapas do projeto</h2><div class="grid g4">'+
  [['2026','Projeto criado','Estudantes da UNIBRA iniciam a construção da proposta da TaskGO.'],
   ['Agora','Primeira versão em desenvolvimento','Construção e refinamento dos primeiros fluxos da plataforma.'],
   ['Próxima etapa','Validação com usuários','Ouvir potenciais clientes e profissionais e testar a experiência.'],
   ['Depois da validação','Lançamento gradual','Abrir a plataforma ao público quando o produto estiver pronto para uso.']]
  .map(t=>'<div class="card lp-feature"><span class="tag tag-info">'+t[0]+'</span><h3>'+t[1]+'</h3><p>'+t[2]+'</p></div>').join('')+'</div>'+
  '<h2 class="lp-subhead">Time fundador</h2><div class="grid g4">'+
  [['Joabe Junior','CEO & Cofundador'],['Arthur Mendes','CTO & Cofundador'],['Thiago Vinicius','Head de Operações'],['Vinicius Ziano','Head de Confiança & Segurança']]
  .map(p=>'<div class="card lp-person">'+avatar({name:p[0]},64)+
    '<b>'+p[0]+'</b><span class="muted">'+p[1]+'</span></div>').join('')+'</div>'+
  '</div></section>';
}
