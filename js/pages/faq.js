/* ---------- FAQ ---------- */
const FAQ=[
  ['A TaskGO já está disponível para contratar serviços?','Ainda não. O TaskGO está em fase de desenvolvimento e validação. O catálogo apresenta categorias previstas para o produto, mas não há contratação ativa nem profissionais cadastrados.'],
  ['A plataforma já calcula estimativas de preço?','Não há cálculo por inteligência artificial nesta versão. Os valores de referência que podem aparecer em demonstrações não são propostas comerciais nem preços confirmados por profissionais.'],
  ['Como funcionam pagamentos e saques?','Pagamentos, carteira e saques não estão habilitados. Nenhuma cobrança ou transferência é feita pela plataforma.'],
  ['Posso acompanhar um profissional no mapa?','O rastreamento não está disponível para clientes porque ainda não há atendimentos ativos na plataforma. A proposta e os limites atuais estão descritos na página Quem Somos.'],
  ['Existe garantia nos serviços?','Não. A TaskGO ainda não oferece garantia, cobertura de danos ou mediação de serviços contratados pelo aplicativo.'],
  ['Posso cancelar um pedido?','Ainda não é possível fazer pedidos nem cancelá-los pela plataforma. A contratação será aberta depois que o MVP for validado e preparado para uso.'],
  ['Como posso participar da validação?','Use o formulário de contato para registrar seu interesse ou compartilhar sugestões. A equipe ainda está validando o produto antes do lançamento.'],
  ['Como me torno um profissional TaskGO?','A proposta está em desenvolvimento e ainda não há pedidos disponíveis. Consulte a página Quem Somos ou fale com a equipe pelo formulário de contato para acompanhar a validação.']
];
function faqList(items){
  return items.map((f,i)=>'<div class="faq-item" id="faq'+i+'"><button class="faq-q" onclick="toggleFaq('+i+')">'+f[0]+ic('plus')+'</button><div class="faq-a"><div>'+f[1]+'</div></div></div>').join('');
}
function toggleFaq(i){const el=$('#faq'+i);if(el)el.classList.toggle('open');}

