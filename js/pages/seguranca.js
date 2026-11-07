/* ---------- SEGURANÇA ---------- */
function pageSeguranca(){
  return folha('segurança',duo('o que protege você','hoje, e o que ainda não',1)+
    '<p class="corpo">A TaskGO está em desenvolvimento. Hoje nenhum pedido pode ser enviado, então o que depende de um pedido aparece como "Aguarda pedidos".</p>','cabeca')+
  folha('recursos','<div class="recursos">'+[
    ['espera','Endereço protegido','O contato e o endereço do cliente só vão aparecer para o profissional depois do aceite.'],
    ['espera','Código de chegada','Um código de 4 dígitos por pedido vai confirmar o início do serviço.'],
    ['espera','Localização compartilhada','Com permissão do profissional, a última posição vai aparecer durante o deslocamento. Não há rota nem registro do trajeto.'],
    ['plan','Verificação de identidade','Ainda não existe. Nenhum documento, selfie ou CPF é validado hoje.'],
    ['espera','Ligação de emergência','Durante um pedido, o painel vai levar direto às ligações para 190 e 192. A TaskGO não tem equipe de segurança de plantão.'],
    ['plan','Pagamento retido','Ainda não existe. A plataforma não processa nem guarda pagamentos.'],
    ['plan','Garantia do serviço','Ainda não existe. A TaskGO não oferece garantia nem cobertura de danos.']
  ].map(x=>'<div class="recurso"><div class="recurso-topo"><h2 class="sub">'+x[1]+'</h2>'+statusTag(x[0])+'</div><p>'+x[2]+'</p></div>').join('')+'</div>'+
  '<p class="aviso-linha mt-grande"><b>Em uma emergência,</b> ligue para a Polícia Militar (190) ou o SAMU (192). Para outros assuntos, fale com a equipe pelo formulário.</p>'+
  '<div class="setas">'+linkSeta('#/contato','Falar com a equipe')+'</div>','folha-densa');
}
