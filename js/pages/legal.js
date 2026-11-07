/* ---------- LEGAL ---------- */
function pageLegal(){
  const docs={
    termos:['Termos de Uso',[
      ['1. Objeto','A TaskGO é uma plataforma tecnológica que intermedeia o contato entre pessoas que desejam contratar serviços e profissionais autônomos que os oferecem. A TaskGO não executa os serviços diretamente.'],
      ['2. Cadastro','O usuário se compromete a fornecer informações verdadeiras e atualizadas. Contas com dados falsos podem ser suspensas sem aviso prévio.'],
      ['3. Pagamentos','Os pagamentos são processados por instituição parceira autorizada pelo Banco Central. A TaskGO retém o valor até a confirmação da conclusão do serviço.'],
      ['4. Taxas','A plataforma cobra uma taxa de serviço sobre cada atendimento concluído, informada previamente ao profissional.'],
      ['5. Cancelamento','Cancelamentos antes do deslocamento são gratuitos. Após o início do deslocamento, pode incidir taxa de compensação.'],
      ['6. Responsabilidades','O profissional é integralmente responsável pela execução técnica do serviço. A TaskGO atua como mediadora em caso de conflito.']
    ]],
    privacidade:['Política de Privacidade',[
      ['1. Dados coletados','Coletamos dados cadastrais (nome, CPF, e-mail, telefone), dados de localização durante atendimentos ativos e dados de uso da plataforma.'],
      ['2. Finalidade','Usamos os dados para viabilizar a contratação, garantir a segurança das partes, calcular estimativas e cumprir obrigações legais.'],
      ['3. Compartilhamento','Compartilhamos apenas o necessário: dados de contato e endereço com o profissional escolhido, e dados de pagamento com o processador parceiro.'],
      ['4. Localização','Com consentimento do profissional, a última posição é compartilhada durante o status a caminho e apagada quando o rastreamento termina.'],
      ['5. Seus direitos','Conforme a LGPD, você pode solicitar acesso, correção, portabilidade ou exclusão dos seus dados pelo e-mail privacidade@taskgo.com.br.'],
      ['6. Retenção','Mantemos os dados pelo prazo legal necessário e os eliminamos com segurança após esse período.']
    ]],
    cancelamento:['Política de Cancelamento e Reembolso',[
      ['1. Antes do aceite','Cancelamento 100% gratuito, com estorno integral e imediato.'],
      ['2. Após o aceite, antes do deslocamento','Gratuito até 5 minutos após o aceite do profissional.'],
      ['3. Durante o deslocamento','Taxa de compensação de até 20% do valor estimado, destinada ao profissional.'],
      ['4. Após a chegada','O valor da visita técnica pode ser cobrado integralmente.'],
      ['5. Serviço mal executado','Abra um chamado em até 90 dias. Após análise, a TaskGO determina reexecução ou reembolso.'],
      ['6. Prazo de estorno','Estornos via PIX em até 1 dia útil; cartão de crédito conforme prazo da operadora.']
    ]]
  };
  const d=docs[route.sub]||docs.termos;
  return folha('documentos','<h1 class="duo"><strong>'+d[0]+'</strong></h1>'+
  '<p class="t2" style="margin:14px 0 26px;font-size:.88rem">Última atualização: '+new Date().toLocaleDateString('pt-BR')+'</p>'+
  '<p class="aviso-linha"><b>Minuta.</b> A TaskGO está em desenvolvimento: pagamentos, retenção de valores, taxas, reembolsos e mediação descritos aqui ainda não existem.</p>'+
  '<div class="filtros">'+[['termos','Termos'],['privacidade','Privacidade'],['cancelamento','Cancelamento']].map(x=>'<a class="pill '+(route.sub===x[0]||(!route.sub&&x[0]==='termos')?'pill-brand':'')+'" href="#/legal/'+x[0]+'">'+x[1]+'</a>').join('')+'</div>'+
  '<div class="lista-legal corpo">'+d[1].map(x=>'<section><h2>'+x[0]+'</h2><p>'+x[1]+'</p></section>').join('')+'</div>','cabeca');
}
