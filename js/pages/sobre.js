/* ---------- QUEM SOMOS ---------- */
function pageSobre(){
  return folha('quem somos',duo('feito por estudantes em Recife,','primeiro para quem trabalha',1)+
    '<p class="corpo">A TaskGO é um projeto em desenvolvimento, criado em 2026 por um grupo de estudantes da UNIBRA, em Recife.</p>','cabeca')+
  folha('a TaskGO hoje','<div class="duas-colunas"><div>'+
    '<p class="corpo">A proposta é aproximar pessoas que precisam de serviços locais de profissionais autônomos. Estamos transformando essa ideia em uma experiência mais simples, organizada e transparente para os dois lados.</p>'+
    '<p class="corpo">A TaskGO ainda está em desenvolvimento: não temos clientes nem profissionais cadastrados. Esta etapa é dedicada a construir a primeira versão, ouvir quem poderá usar a plataforma e validar os fluxos antes de ampliar o projeto.</p></div>'+
    '<div><h2 class="bloco-titulo">a TaskGO hoje</h2><div class="tabela-hoje">'+
    [['Fundação do projeto','2026'],['Origem','Estudantes da UNIBRA · Recife'],['Fase atual','Primeira versão em desenvolvimento'],['Clientes cadastrados','0'],['Profissionais cadastrados','0']]
    .map(n=>'<div><span class="t2">'+n[0]+'</span><b>'+n[1]+'</b></div>').join('')+'</div></div></div>','folha-densa')+
  folha('propósito','<div class="recursos">'+[
    ['O problema','Indicação, conversa, preço e acompanhamento ficam espalhados entre canais diferentes.'],
    ['Para quem','Profissionais autônomos primeiro: sem eles não há quem atenda. Depois, quem precisa contratar um serviço local.'],
    ['No que acreditamos','Transparência, segurança, respeito ao trabalho e escuta ativa em cada etapa.'],
    ['O que fazemos agora','Concluir a primeira versão e validar a proposta com potenciais clientes e profissionais em Recife.']
  ].map(x=>'<div class="recurso"><h2 class="sub" style="margin-bottom:10px">'+x[0]+'</h2><p>'+x[1]+'</p></div>').join('')+'</div>','folha-densa')+
  folha('etapas',duo('etapas','do projeto')+
    '<div class="duelo">'+[
      ['2026','Projeto criado','Estudantes da UNIBRA iniciam a construção da proposta da TaskGO.'],
      ['Agora','Primeira versão em desenvolvimento','Construção e refinamento dos primeiros fluxos da plataforma.'],
      ['Próxima etapa','Validação com usuários','Ouvir potenciais clientes e profissionais e testar a experiência.'],
      ['Depois da validação','Lançamento gradual','Abrir a plataforma ao público quando o produto estiver pronto para uso.']
    ].map(t=>'<div class="duelo-linha"><span class="t2">'+t[0]+'</span><h3>'+t[1]+'</h3><p>'+t[2]+'</p></div>').join('')+'</div>')+
  folha('time',duo('time','fundador')+
    '<div class="pessoas" style="margin-top:36px">'+[
      ['Joabe Junior','CEO & Cofundador','joabe'],['Arthur Mendes','CTO & Cofundador','arthur'],['Thiago Vinicius','Head de Operações','thiago'],['Vinicius Ziano','Head de Confiança & Segurança','vinicius']
    ].map(p=>'<div class="pessoa">'+avatar({name:p[0],photo:'assets/photos/site/equipe-'+p[2]+'.jpg'},72)+'<div><b>'+p[0]+'</b><span>'+p[1]+'</span></div></div>').join('')+'</div>');
}
