# Mensagens, notificacoes e contato

## Auditoria e comportamento

- Mensagens de conversas vinculadas a pedidos ja usavam a entidade `Mensagem` e a tabela `mensagens`, mas faltavam destinatario e leitura. O frontend carregava o historico pela API, porem sem polling; as tentativas de envio usavam chave idempotente.
- Notificacoes de contas reais eram mantidas no JSON `taskgoData` do usuario e tambem em estado local. Os canais push, SMS e e-mail nao existiam.
- O formulario de contato apenas limpava os campos e mostrava um toast. O painel de suporte exibia uma resposta fixa e fingia disponibilidade de atendente.
- Nao foi encontrada automacao real de resposta nas conversas. A resposta fixa de suporte foi removida; nenhuma resposta e criada automaticamente.

## Persistencia e endpoints

As entidades sao criadas/atualizadas pelo Hibernate usando `spring.jpa.hibernate.ddl-auto=update`, sem apagar tabelas existentes:

- `mensagens`: agora inclui `destinatario_id`, `lida_em` e `automatica`. As novas linhas registram autor e destinatario derivados do pedido e da sessao autenticada. Campos novos aceitam null em linhas antigas para preservar os dados existentes.
- `notificacoes`: historico da caixa de entrada no banco, com chave de evento unica por destinatario, canal `in_app` e estado `criada`. Este estado significa que o registro foi criado na caixa do aplicativo, nao que e-mail, push ou SMS foi entregue.
- `contatos_site`: nome, e-mail, assunto, mensagem, data e estado `registrada`. A confirmacao de cadastro nao afirma encaminhamento ao suporte nem resposta enviada.

Endpoints autenticados:

- `GET /api/pedidos/contratados/{pedidoId}/mensagens`: historico cronologico; marca como lidas somente as mensagens recebidas pelo usuario da sessao.
- `POST /api/pedidos/contratados/{pedidoId}/mensagens`: persiste mensagem do participante autenticado, usa `clientMessageId` para idempotencia e cria uma notificacao interna para o outro participante.
- `GET /api/notificacoes`: caixa do usuario autenticado.
- `GET /api/notificacoes/nao-lidas`: total de nao lidas.
- `PATCH /api/notificacoes/{id}/lida` e `PATCH /api/notificacoes/lidas`: atualizam leitura somente para o proprietario.

Endpoint publico, protegido por CSRF e limitador de abuso:

- `POST /api/contatos`: recebe os campos do formulario e persiste a solicitacao antes de confirmar sucesso. Limite atual: cinco envios por IP a cada dez minutos, honeypot e validacao de tamanhos/e-mail. O limite e mantido em memoria e reinicia junto com a API; para varias instancias, substitua-o por um limitador compartilhado.

## Atualizacao e canais

O historico de mensagens e atualizado pela API a cada cinco segundos enquanto a conversa esta aberta. A caixa de notificacoes atualiza a cada vinte segundos enquanto a sessao esta no painel. Isso nao e entrega em tempo real garantida.

Somente notificacoes dentro do aplicativo estao integradas. Nao ha credenciais ou provedor configurados para SMTP/e-mail, Web Push ou SMS; esses canais nao sao enviados e nao ha variaveis de ambiente a configurar ate que um provedor seja escolhido. Nao foi adicionada integracao especulativa. Para habilitar canais externos, definir provedor, credenciais em variaveis de ambiente, consentimento/preferencias, registro de tentativas, idempotencia e testes de homologacao antes de exibir estados de entrega.

Nao existe resposta automatica nem IA para mensagens. Para implementar uma no futuro, definir os eventos elegiveis, regras contra duplicidade e rotulo de mensagem automatica, e salvar a resposta pelo backend. Nenhuma resposta fixa e apresentada como gerada por IA.

## Execucao e limites atuais

1. Configure PostgreSQL local e `DB_PASSWORD` como ja exigido em `backend/src/main/resources/application.properties`.
2. Execute `mvn test` dentro de `backend`.
3. Inicie a API com `mvn spring-boot:run` e sirva o frontend em `http://localhost:5500`.
4. Para testar uma mensagem, autentique cliente e profissional em contas separadas, abra um pedido aceito e envie nos dois lados. O historico deve reaparecer depois de atualizar a pagina.
5. Envie o formulario de contato e confirme a linha em `contatos_site`; uma repeticao acima do limite recebe HTTP 429.

O formulario persiste contatos, mas ainda nao existe painel administrativo para a equipe consultar/responder esses registros. O e-mail de encaminhamento e confirmacao tambem nao esta configurado. Push e SMS nao estao implementados. Portanto, esses canais e o processamento da equipe permanecem pendentes de provedor e fluxo operacional.
