# Pagamentos TaskGO

## Estado atual

O TaskGO **não processa pagamentos reais**. O checkout, a carteira, recargas, saques, assinaturas e lançamentos financeiros estão desativados no frontend. Valores antigos no `localStorage` ou em dados de demonstração não são dinheiro e não devem ser convertidos em saldo real. O backend ainda não possui integração com provedor, entidade de pagamento, endpoint de cobrança ou receptor de webhook.

Essa barreira é intencional: não existe credencial Mercado Pago nem URL HTTPS pública configurada neste ambiente. Definir as variáveis abaixo, por si só, **não ativa cobranças**; é necessário implementar e validar os endpoints, a persistência e o webhook antes de mudar o frontend para o fluxo real.

## Provedor recomendado

Mercado Pago Checkout Pro é a opção inicial recomendada para este MVP porque envia o comprador a uma página hospedada pelo provedor, mantendo os dados do cartão fora do TaskGO, e suporta PIX e cartão. O backend deverá criar uma preferência por pedido e usar o `init_point` retornado; a aprovação deverá vir de consulta autenticada ao pagamento após o webhook, nunca da URL de retorno.

A API oficial documenta `POST /checkout/preferences` e o `init_point` para iniciar o checkout ([criar preferência](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-preferences/create-payment-preference), [referência da API](https://www.mercadopago.com.br/developers/pt/reference/online-payments/checkout-pro-preferences/overview)). Os webhooks de pagamento usam HTTPS e assinatura `x-signature`; o servidor deve validar a assinatura e consultar o estado do pagamento no Mercado Pago antes de atualizar um pedido ([notificações e validação](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-preferences/payment-notifications)).

## Configuração reservada

As propriedades `taskgo.payments.*` em `application.properties` reservam os nomes de configuração. Nenhuma classe de integração as consome neste momento.

Após a implementação do provedor, configurar em ambiente seguro:

| Variável | Uso previsto |
| --- | --- |
| `PAYMENTS_ENABLED` | Chave explícita para habilitar o fluxo depois de validado; manter `false` até lá. |
| `PAYMENTS_PROVIDER` | Provedor selecionado (`mercadopago`). |
| `MERCADOPAGO_ACCESS_TOKEN` | Token privado de teste ou produção, somente no backend. |
| `MERCADOPAGO_WEBHOOK_SECRET` | Segredo usado para validar a assinatura dos webhooks. |
| `PAYMENTS_PUBLIC_BASE_URL` | URL HTTPS pública do backend para o webhook. |

Não colocar tokens em JavaScript, versionamento, mensagens ou logs. Usar credenciais de teste e notificações simuladas no painel do provedor antes de produção. O endpoint de webhook precisa ser acessível por HTTPS; `localhost` não atende esse requisito.

## Trabalho necessário para ativar

1. Criar registros de pagamento no PostgreSQL, com restrição de unicidade por pedido/tentativa e identificadores do provedor.
2. Implementar criação idempotente de preferência no backend, usando valor e proprietário obtidos do pedido salvo.
3. Redirecionar ao checkout hospedado e remover qualquer captura de cartão no frontend.
4. Implementar o webhook HTTPS, validar `x-signature`, consultar o pagamento no provedor e validar valor, moeda e referência externa.
5. Atualizar pedido e pagamento em transação, com idempotência para eventos repetidos; só então disponibilizar o pedido ao profissional.
6. Definir conciliação, cancelamento, reembolso, contestação, retenção e repasse antes de habilitar carteira ou saque. Checkout Pro isoladamente não configura a operação de marketplace nem liquida automaticamente valores ao prestador.
7. Adicionar testes de integração com sandbox e validar persistência no PostgreSQL antes de habilitar `PAYMENTS_ENABLED`.

Não existe saldo financeiro ou repasse para prestadores implementado no backend. Até haver uma estrutura de ledger e uma solução de liquidação apropriada, a carteira e os saques permanecem indisponíveis.
