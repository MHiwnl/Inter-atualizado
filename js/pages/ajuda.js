/* ---------- AJUDA ---------- */
function pageAjuda(){
  return folha('central de ajuda',duo('como podemos','ajudar?',1),'cabeca')+
  folha('perguntas','<h2 class="bloco-titulo">perguntas frequentes</h2><div class="faq-lista">'+faqList(FAQ)+'</div>'+
  '<p class="corpo" style="margin-top:36px">Não achou o que procurava? Ainda não há atendimento em tempo real. Deixe sua mensagem no formulário de contato.</p>'+
  '<div class="setas">'+linkSeta('#/contato','Falar com a equipe',1)+'</div>','folha-densa');
}
