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
      ['4. Localizacao','Com consentimento do profissional, a ultima posicao e compartilhada durante o status a caminho e apagada quando o rastreamento termina.'],
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
  return '<section class="section"><div class="wrap" style="max-width:800px">'+
  '<span class="eyebrow">'+ic('file')+' Documentos legais</span><h2 style="margin:14px 0 8px">'+d[0]+'</h2>'+
  '<p class="muted" style="margin-bottom:34px">Última atualização: '+new Date().toLocaleDateString('pt-BR')+'</p>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:30px">'+
  [['termos','Termos'],['privacidade','Privacidade'],['cancelamento','Cancelamento']].map(x=>'<a class="pill '+(route.sub===x[0]||(!route.sub&&x[0]==='termos')?'pill-brand':'')+'" href="#/legal/'+x[0]+'">'+x[1]+'</a>').join('')+'</div>'+
  d[1].map(s=>'<div style="margin-bottom:26px"><h3 style="font-size:1.05rem;margin-bottom:8px">'+s[0]+'</h3><p class="t2" style="font-size:.95rem">'+s[1]+'</p></div>').join('')+
  '</div></section>';
}

