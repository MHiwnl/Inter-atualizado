# Financeiro TaskGo: estado atual

## Persistência e endpoints

O Hibernate cria/atualiza as tabelas aditivas `carteiras`, `transacoes_financeiras` e `solicitacoes_saque` usando a configuração atual `spring.jpa.hibernate.ddl-auto=update`. Valores são `NUMERIC(19,2)` no PostgreSQL e `BigDecimal` no Java. Carteiras têm uma linha por usuário, controle de versão e bloqueio pessimista para reserva de saldo. O extrato é paginado e não tem endpoint de edição.

- `GET /api/financeiro/carteira`: cria uma carteira vazia no primeiro acesso e retorna disponível, pendente e bloqueado.
- `GET /api/financeiro/transacoes?page=0&size=20`: extrato da sessão autenticada, no máximo 100 por página.
- `GET /api/financeiro/saques`: solicitações da sessão autenticada.
- `POST /api/financeiro/saques` com `Idempotency-Key` e `{ "valor": 10.00 }`: exclusivo para conta profissional; verifica saldo, reserva o valor e grava solicitação e evento de extrato na mesma transação.

As rotas identificam a conta pela sessão, nunca por um ID enviado pelo navegador. Valores precisam ser positivos e ter no máximo duas casas decimais. Repetir uma chave com o mesmo valor retorna a solicitação anterior; reutilizá-la com outro valor resulta em conflito.

## Limites operacionais

Não existe endpoint para creditar saldo. Apenas uma futura integração backend autenticada poderá criar créditos depois de verificar o provedor. Portanto, carteiras novas começam em R$ 0,00 e saques são recusados por saldo insuficiente. `SOLICITADO` significa que o pedido foi gravado e o saldo reservado; não significa que houve transferência. Ainda faltam payout real, estados de conclusão/recusa/cancelamento e liberação de reserva após falha.

Plus, checkout e confirmação por webhook permanecem desativados. As propriedades `PAYMENTS_ENABLED`, `PAYMENTS_PROVIDER`, `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET` e `PAYMENTS_PUBLIC_BASE_URL` são somente configuração preparada; este código não chama Mercado Pago e não valida webhooks. Não habilite cobrança com `PAYMENTS_ENABLED=true` até existir integração e validação implementadas.

O frontend real lê carteira/extrato desta API e não usa `localStorage` como fonte financeira. O modo `?demo=1` exibe cenários fictícios com aviso. Plus e contratação ficam indisponíveis fora desse modo demonstrativo.

## Execução local

Configure `DB_PASSWORD` para o PostgreSQL local e execute a API com `mvn spring-boot:run` dentro de `backend`. O banco `taskgo_db` deve existir. Pagamentos ficam desativados; não é necessária chave de provedor para consultar uma carteira vazia.
