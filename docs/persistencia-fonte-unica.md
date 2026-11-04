# Persistência e fonte única de dados

## Regra de execução

O modo real consulta e altera dados pela API Spring Boot e pelo PostgreSQL. O frontend não lê nem grava o conjunto de demonstração no `localStorage`. Os exemplos fixos do projeto só são carregados com `?demo=1` na URL (para apresentação local); a sessão continua isolada desse modo.

## Módulos revisados

| Dados | Fonte no modo real | Estado |
| --- | --- | --- |
| Conta, perfil, categoria, endereço e nascimento | `usuarios` / `/api/auth` | Persistido; senha com hash. |
| Catálogo de profissionais | `usuarios` / `GET /api/profissionais` | Lista apenas cadastros existentes; sem preço, distância ou avaliação inventados. |
| Pedido, aceite, status, cancelamento e avaliação | `pedidos` / `/api/pedidos/contratados` | Persistido e restrito aos participantes. Avaliação bilateral vinculada ao pedido. |
| Conversa | `mensagens` / `/api/pedidos/contratados/{id}/mensagens` | Persistida, protegida por participação e idempotente por autor. |
| Preferências do perfil | `usuarios.extra.taskgoData` / `/api/auth/dados` | Preferências cadastradas ficam no servidor. |
| Notificações de eventos | — | Ainda não há serviço de eventos/API persistida; notificações de demonstração não são exibidas no modo real. |
| Carteira, transações e pagamentos | — | Não há ledger nem provedor de pagamento. O checkout e operações financeiras permanecem indisponíveis e nenhum dado financeiro de demonstração é tratado como real. |
| Coordenadas, disponibilidade e verificação de identidade | — | Não fornecidas pelo backend; interface informa a ausência desses dados. |

## Comportamento técnico

- O modo real inicia com listas vazias e hidrata sessão, perfil, profissionais e pedidos a partir do backend.
- Operações de perfil, pedidos, avaliações e mensagens atualizam a interface após confirmação da API.
- A exclusão de conta também remove as mensagens dos pedidos associados.
- A tabela `mensagens` é criada pelo mapeamento JPA conforme a configuração atual do projeto.
- O modo demonstração permanece disponível explicitamente via `?demo=1`; não é uma fonte alternativa para contas reais.

## Testes

`mvn test` cobre autenticação, perfil, pedidos e transições, segurança e paginação, profissionais públicos, mensagens e avaliações. Os testes atuais são unitários e de camada MVC com dependências simuladas; não substituem um teste de integração com PostgreSQL real.

## Resultado desta execução local

- `node --check` foi executado em todos os arquivos JavaScript: passou.
- `mvn test` passou com 37 testes, sem falhas ou erros.
- Os testes cobrem controller/services com repositórios simulados; não são testes de persistência PostgreSQL.
- A porta local 5432 está ouvindo, mas `DB_PASSWORD` não está configurada nesta sessão. Por isso cadastro, atualização, reinício e recuperação usando o PostgreSQL real não foram validados nesta execução.
- Sem ledger/provedor financeiro, carteira, pagamentos, saques, estimativa comercial e recompensas de indicação ficam indisponíveis no modo real. A tela de demonstração continua com dados separados e aviso explícito.
