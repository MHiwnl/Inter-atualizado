# TaskGO

Plataforma web para aproximar pessoas que precisam de serviços locais de profissionais autônomos, com busca por categoria, pedidos, conversa e acompanhamento do atendimento.

> **Estágio atual: MVP em desenvolvimento.** A TaskGO foi criada em 2026 por estudantes da UNIBRA, em Recife, e ainda não está aberta ao público. Pagamentos, saques, login social e verificação de identidade **não** estão ativos.

## Sumário

- [O que é o projeto](#o-que-é-o-projeto)
- [Stack tecnológica](#stack-tecnológica)
- [Estrutura analítica do projeto (EAP)](#estrutura-analítica-do-projeto-eap)
- [Recursos de destaque recentes](#recursos-de-destaque-recentes)
- [Estrutura de arquivos](#estrutura-de-arquivos)
- [Segurança e autenticação](#segurança-e-autenticação)
- [Como executar localmente](#como-executar-localmente)
- [Como executar via Docker](#como-executar-via-docker)
- [Manutenção e otimização do banco de dados](#manutenção-e-otimização-do-banco-de-dados)
- [Testes](#testes)
- [Limitações e problemas conhecidos](#limitações-e-problemas-conhecidos)
- [Documentação complementar](#documentação-complementar)

## O que é o projeto

A TaskGO conecta dois públicos:

- **Clientes**, que escolhem uma categoria de serviço, abrem um pedido e acompanham o atendimento.
- **Profissionais**, que recebem oportunidades compatíveis com sua categoria, aceitam pedidos e conversam com o cliente.

O projeto tem dois modos de execução:

| Modo | Como ativar | Fonte dos dados |
|---|---|---|
| **Real** | Padrão | API Spring Boot e PostgreSQL |
| **Demonstração** | `?demo=1` na URL, somente em `localhost` | Dados fictícios, com aviso na tela; não se misturam às contas reais |

Preços dos planos e o simulador de ganhos aparecem apenas no modo de demonstração.

## Stack tecnológica

| Camada | Tecnologias |
|---|---|
| **Frontend** | HTML, CSS e JavaScript puros, sem framework e sem etapa de build; rotas por hash (`#/...`) |
| **Mapas** | Leaflet 1.9.4 com tiles do OpenStreetMap |
| **Tipografia** | Inter, Inter Tight e Plus Jakarta Sans (Google Fonts) |
| **Backend** | Java 17, Spring Boot 3.4.5, Spring Web, Spring Security, Spring Data JPA, Actuator e Spring Mail |
| **Banco de dados** | PostgreSQL 14 ou superior (Docker usa a versão 16), com migrações Flyway |
| **Testes** | JUnit 5, Mockito, MockMvc, Spring Security Test e H2 no backend; `node:test` no frontend |
| **Infraestrutura** | Docker, Docker Compose (somente para o banco) e GitHub Actions |

```text
Navegador (HTML/CSS/JS)
        │  HTTPS, cookies de sessão e token CSRF
        ▼
API Spring Boot (porta 8080)
        │  JPA e Flyway
        ▼
PostgreSQL
```

## Estrutura analítica do projeto (EAP)

Legenda: ✅ implementado · 🟡 parcial · ⛔ ainda não implementado

```text
TaskGO
├── 1. Site público
│   ├── 1.1 Início, Serviços, Como Funciona, Para Profissionais, Quem Somos, Planos  ✅
│   ├── 1.2 Segurança, Ajuda/FAQ, Contato e páginas legais                           ✅
│   └── 1.3 Tema claro/escuro e layout responsivo                                    ✅
├── 2. Contas e acesso
│   ├── 2.1 Cadastro de cliente e profissional, login e sessão                       ✅
│   ├── 2.2 Perfil, troca de senha e exclusão de conta                               ✅
│   ├── 2.3 Recuperação de senha (o envio exige SMTP configurado)                    🟡
│   ├── 2.4 Login com Google e Apple                                                 ⛔
│   └── 2.5 Verificação de documento e facial                                        ⛔
├── 3. Pedidos e atendimento
│   ├── 3.1 Criação, aceite, status, cancelamento e avaliação                        ✅
│   ├── 3.2 Oportunidades paginadas, sem expor contato antes do aceite               ✅
│   ├── 3.3 Conversa por pedido, com histórico persistido                            ✅
│   ├── 3.4 Última localização compartilhada pelo profissional                       ✅
│   └── 3.5 Rota, distância percorrida e previsão de chegada                         ⛔
├── 4. Comunicação
│   ├── 4.1 Notificações dentro do aplicativo                                        ✅
│   ├── 4.2 Formulário de contato persistido                                         ✅
│   ├── 4.3 Painel da equipe para responder contatos                                 ⛔
│   └── 4.4 Notificações por e-mail, push e SMS                                      ⛔
├── 5. Financeiro
│   ├── 5.1 Carteira, extrato e solicitação de saque (sem crédito nem repasse real)  🟡
│   └── 5.2 Checkout, webhook, assinatura Plus e pagamento real                      ⛔
└── 6. Qualidade e operação
    ├── 6.1 Testes automatizados e CI                                                ✅
    ├── 6.2 Migrações, Dockerfile e guia de implantação                              ✅
    ├── 6.3 Testes de integração com PostgreSQL e testes E2E no repositório          ⛔
    └── 6.4 Publicação em ambiente de produção                                       ⛔
```

## Recursos de destaque recentes

- **Nova interface pública:** Início, Serviços, Como Funciona, Para Profissionais, Quem Somos, Planos, login, cadastro e recuperação de senha ganharam novo layout, nova tipografia e novos componentes, mantendo as cores do site, os textos e o tema claro/escuro. Os estilos ficam em `css/landing.css`, restritos a essas telas, para não afetar o painel.
- **Sessão no servidor:** a identidade vem da sessão do Spring Security, e o navegador não guarda senha, hash ou token de sessão.
- **Recuperação de senha:** token de uso único, válido por 30 minutos e armazenado somente como hash.
- **Conversas e notificações persistidas:** mensagens idempotentes por pedido e caixa de entrada no banco. A atualização usa consulta periódica, a cada 5 segundos na conversa e a cada 20 segundos nas notificações, e não é em tempo real.
- **Localização com consentimento:** o profissional inicia o compartilhamento em um pedido `a_caminho`. O banco guarda só a posição mais recente, que é removida quando o pedido muda de estado ou o compartilhamento termina.
- **Contato protegido:** o formulário tem limite por IP, campo-armadilha contra robôs e validação de tamanho e e-mail.
- **Base financeira:** carteira, extrato paginado e saque idempotente estão preparados, mas não há como creditar saldo nem transferir dinheiro.

## Estrutura de arquivos

```text
.
├── index.html                  # Página única; carrega todo o CSS e JS
├── favicon.svg
├── .env.example                # Modelo de variáveis locais
├── docker-compose.yml          # PostgreSQL local
├── assets/                     # Vídeos
├── css/
│   ├── base.css                # Cores (tokens), reset e tipografia base
│   ├── components.css          # Botões, cards e formulários
│   ├── site.css                # Hero, faixa de categorias, FAQ e rodapé
│   ├── auth.css                # Telas de acesso
│   ├── painel.css              # Painel logado
│   ├── responsive.css          # Ajustes por tamanho de tela
│   └── landing.css             # Visual das páginas públicas e de acesso
├── js/
│   ├── taskgo-config.js        # URL pública da API (nunca coloque segredos aqui)
│   ├── core/                   # Configuração, estado, rotas, layout e utilitários
│   ├── features/               # Mapa e estimativa de preço
│   ├── pages/                  # Páginas públicas e autenticação
│   ├── painel/                 # Telas do painel logado
│   └── app/                    # Renderização e inicialização
├── tests/                      # Testes do frontend (node:test)
├── docs/                       # Implantação, segurança, testes e decisões
├── .github/workflows/          # CI: testes de frontend e backend
└── backend/
    ├── Dockerfile
    ├── pom.xml
    └── src/
        ├── main/java/com/taskgo/api/   # Controllers, serviços, entidades e repositórios
        ├── main/resources/
        │   ├── application*.properties # Configuração padrão, dev e prod
        │   └── db/migration/           # Migrações Flyway
        └── test/                       # Testes da API
```

## Segurança e autenticação

**Autenticação**

- Senhas são armazenadas com **BCrypt**, e as respostas da API nunca incluem senha ou hash.
- A sessão usa o cookie `JSESSIONID` com `HttpOnly`, expira em 30 minutos e troca de identificador ao autenticar.
- Trocar a senha incrementa `credential_version`, o que encerra as sessões antigas.
- Toda operação que altera dados exige o token CSRF no cabeçalho `X-XSRF-TOKEN`, obtido em `GET /api/auth/csrf`.

**Autorização**

- Por padrão, os endpoints exigem autenticação. As exceções públicas são login, cadastro, CSRF, recuperação de senha, catálogo de profissionais, estimativa, contato e health check.
- A identidade vem sempre da sessão, nunca de um e-mail ou ID enviado pelo navegador.
- Pedidos e conversas são restritos aos participantes. O endereço e o contato do cliente só são revelados depois do aceite.
- Ainda não existe papel de administrador.

**Limites de abuso** (em memória, por IP e por instância da API)

| Fluxo | Limite |
|---|---|
| Falhas de login | 10 a cada 5 minutos |
| Recuperação de senha | 5 a cada 15 minutos |
| Formulário de contato | 5 a cada 10 minutos |

**Cookies por perfil**

| Perfil | `Secure` | `SameSite` |
|---|---|---|
| `dev` | `false` por padrão | `lax` por padrão |
| `prod` | `true` | `none` por padrão |

**Regras para produção**

- Sirva frontend e API por HTTPS e liste em `TASKGO_CORS_ALLOWED_ORIGINS` somente as origens reais. Nunca use `*`.
- Mantenha segredos em variáveis de ambiente da plataforma. Nunca os coloque em `js/taskgo-config.js`, que é público.
- Com mais de uma instância da API, mova os limitadores para um armazenamento compartilhado ou para o gateway.
- Não ative `PAYMENTS_ENABLED`: as variáveis de pagamento apenas reservam nomes, e não existe integração com um provedor.

Detalhes em [docs/seguranca-autenticacao.md](docs/seguranca-autenticacao.md) e [backend/AUTH_RECOVERY.md](backend/AUTH_RECOVERY.md).

## Como executar localmente

**Pré-requisitos:** JDK 17, Maven 3.9 ou superior, PostgreSQL 14 ou superior e um servidor estático (Live Server do VS Code ou Python).

**1. Crie o banco** com um usuário administrador do PostgreSQL:

```sql
CREATE ROLE taskgo_app LOGIN PASSWORD 'troque-por-uma-senha-local';
CREATE DATABASE taskgo_db OWNER taskgo_app;
```

**2. Inicie a API** no PowerShell:

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/taskgo_db"
$env:DB_USERNAME = "taskgo_app"
$env:DB_PASSWORD = "troque-por-uma-senha-local"
$env:TASKGO_CORS_ALLOWED_ORIGINS = "http://localhost:5500"
cd backend
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

O Flyway cria as tabelas na primeira execução.

**3. Aponte o frontend para a API** em `js/taskgo-config.js`. Não faça commit dessa alteração:

```js
window.TASKGO_CONFIG = { apiBaseUrl: 'http://localhost:8080' };
```

**4. Sirva o frontend** a partir da raiz do projeto, em um segundo terminal:

```powershell
python -m http.server 5500
```

**5. Abra <http://localhost:5500/index.html>.**

> [!IMPORTANT]
> Use `localhost`, **não** `127.0.0.1`. O Live Server costuma abrir `127.0.0.1:5500`, e nesse endereço o cadastro falha com "Não foi possível iniciar uma solicitação segura", porque o navegador não consegue ler o cookie CSRF. Basta trocar o endereço na barra do navegador.

Para ver a interface sem backend, abra `http://localhost:5500/index.html?demo=1`.

## Como executar via Docker

Este caminho dispensa instalar Java, Maven e PostgreSQL. O banco usa a porta `55432` para não conflitar com um PostgreSQL já instalado. Os comandos são para PowerShell, executados na raiz do projeto, com o Docker Desktop aberto.

**1. Crie o arquivo `.env`** e troque `DB_PASSWORD` por uma senha forte. O git ignora esse arquivo.

```powershell
Copy-Item .env.example .env
notepad .env
```

**2. Crie a rede e o banco:**

```powershell
$senha = (Select-String -Path .env -Pattern '^DB_PASSWORD=(.*)$').Matches.Groups[1].Value
docker network create taskgo-dev
docker run -d --name taskgo-dev-db --network taskgo-dev --restart unless-stopped `
  -e POSTGRES_DB=taskgo_db -e POSTGRES_USER=taskgo_app -e POSTGRES_PASSWORD=$senha `
  -p 127.0.0.1:55432:5432 -v taskgo-dev-db:/var/lib/postgresql/data postgres:16
```

**3. Compile e inicie a API.** A primeira compilação leva alguns minutos.

```powershell
docker build -t taskgo-api:dev backend
docker run -d --name taskgo-dev-api --network taskgo-dev --restart unless-stopped --env-file .env `
  -e SPRING_PROFILES_ACTIVE=dev `
  -e DB_URL=jdbc:postgresql://taskgo-dev-db:5432/taskgo_db `
  -e MANAGEMENT_HEALTH_MAIL_ENABLED=false `
  -p 127.0.0.1:8080:8080 taskgo-api:dev
```

**4. Confirme que a API subiu.** A resposta esperada é `{"status":"UP"}`.

```powershell
curl.exe http://localhost:8080/actuator/health
```

**5. Sirva o frontend** como nos passos 3 a 5 de [Como executar localmente](#como-executar-localmente).

**Comandos do dia a dia**

| Ação | Comando |
|---|---|
| Parar | `docker stop taskgo-dev-api taskgo-dev-db` |
| Iniciar de novo | `docker start taskgo-dev-db taskgo-dev-api` |
| Ver logs da API | `docker logs -f taskgo-dev-api` |
| Atualizar a API | `docker rm -f taskgo-dev-api`, depois repita o passo 3 |
| Apagar o banco local e **todos os seus dados** | `docker rm -f taskgo-dev-db` e `docker volume rm taskgo-dev-db` |

> [!NOTE]
> `docker compose up -d postgres` também inicia um banco, usando `DB_PASSWORD` do ambiente, mas na porta `5432`. Ele não inicia a API e entra em conflito com um PostgreSQL já instalado nessa porta.

## Manutenção e otimização do banco de dados

Os exemplos usam o contêiner `taskgo-dev-db`. Em produção, execute o SQL na instância do provedor. Consultas de diagnóstico abrem com:

```powershell
docker exec -it taskgo-dev-db psql -U taskgo_app -d taskgo_db
```

### Backup e restauração

Faça um backup antes de qualquer migração. Gere o arquivo dentro do contêiner e copie com `docker cp`, para que o redirecionamento do PowerShell não corrompa o conteúdo binário:

```powershell
docker exec taskgo-dev-db pg_dump -U taskgo_app -d taskgo_db --format=custom --no-owner --file=/tmp/taskgo.dump
docker cp taskgo-dev-db:/tmp/taskgo.dump ./taskgo-backup.dump
docker exec taskgo-dev-db rm /tmp/taskgo.dump
```

Para restaurar em uma instância **vazia** de homologação:

```sh
pg_restore --no-owner --dbname="$DATABASE_URL_HOMOLOG" taskgo-backup.dump
```

Teste a restauração periodicamente. Backups contêm dados pessoais: restrinja o acesso e nunca os envie ao repositório.

### Migrações

- O esquema é versionado pelo Flyway em `backend/src/main/resources/db/migration`.
- **Nunca edite uma migração já aplicada.** Crie uma nova, como `V2__descricao.sql`.
- O perfil `dev` usa `ddl-auto=update`, e o Hibernate pode criar objetos fora das migrações. Por isso, uma mudança de esquema só está pronta quando existe em uma migração.
- O perfil `prod` usa `ddl-auto=validate` e não altera o esquema sozinho.

```sql
SELECT installed_rank, version, description, success FROM flyway_schema_history ORDER BY 1;
```

### Rotina de saúde

O autovacuum do PostgreSQL deve permanecer ligado. Use estas consultas para acompanhar o banco e, depois de grandes cargas ou remoções, execute `VACUUM (ANALYZE);`.

```sql
-- Tamanho do banco
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Tabelas com mais linhas mortas
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum, last_autoanalyze
FROM pg_stat_user_tables ORDER BY n_dead_tup DESC;

-- Índices pouco usados (só avalie depois de um período com tráfego real)
SELECT relname, indexrelname, idx_scan, pg_size_pretty(pg_relation_size(indexrelid))
FROM pg_stat_user_indexes ORDER BY idx_scan ASC;

-- Conexões abertas neste banco
SELECT count(*) FROM pg_stat_activity WHERE datname = current_database();
```

### Índices

Hoje as tabelas têm apenas chaves primárias e índices únicos. As consultas frequentes por e-mail, usuário e pedido ainda não têm índice próprio, o que pode pesar conforme os dados crescerem.

Candidatos para uma futura migração `V2`:

```sql
CREATE INDEX ix_pedidos_client_email ON pedidos (UPPER(client_email));
CREATE INDEX ix_pedidos_pro_email ON pedidos (UPPER(pro_email));
CREATE INDEX ix_mensagens_pedido_criada ON mensagens (pedido_id, criada_em);
CREATE INDEX ix_notificacoes_usuario_criada ON notificacoes (usuario_id, criada_em DESC);
CREATE INDEX ix_estimativas_email ON pedidos_estimativa (UPPER(email_cliente));
CREATE INDEX ix_transacoes_usuario_criada ON transacoes_financeiras (usuario_id, criada_em DESC);
```

O `UPPER` acompanha as buscas sem diferenciar maiúsculas, geradas pelo Spring Data. Antes de adotar um índice, confirme o ganho com `EXPLAIN (ANALYZE, BUFFERS)` em uma cópia com volume realista, porque índices também deixam as escritas mais lentas. Em tabelas grandes de produção, prefira `CREATE INDEX CONCURRENTLY`, que não pode rodar dentro de uma transação e exige configurar a migração do Flyway para isso.

### Outras otimizações identificadas

- **Listas sem paginação:** mensagens de um pedido e notificações de um usuário são carregadas por inteiro. Pedidos estimados, oportunidades e extrato já são paginados, com no máximo 100 itens por página.
- **Consultas repetidas:** `GET /api/profissionais` faz uma consulta de avaliações por profissional. Uma única consulta agregada reduziria esse custo.
- **Consulta periódica:** conversas abertas e notificações geram requisições constantes, então vale considerar esse volume ao dimensionar a API e o banco.
- **Conexões:** `DB_POOL_MAX_SIZE` e `DB_POOL_MIN_IDLE` valem 10 e 2 por padrão. Em ambientes pequenos, ajuste-os ao limite de conexões do plano.

### Retenção de dados

Não há tarefas agendadas de limpeza. Tokens de recuperação expirados ou usados podem ser removidos com:

```sql
DELETE FROM tokens_recuperacao_senha WHERE expira_em < now() OR usado_em IS NOT NULL;
```

A tabela `contatos_site` guarda dados pessoais sem prazo de exclusão. Defina uma política de retenção compatível com a LGPD antes do lançamento.

## Testes

```powershell
# Frontend
node --test tests/*.test.cjs

# Sintaxe do JavaScript
Get-ChildItem js -Recurse -Filter '*.js' | ForEach-Object { node --check $_.FullName }

# Backend (JDK 17 e Maven)
cd backend
mvn test
```

O GitHub Actions executa essas verificações a cada push e pull request. Os testes da API usam dependências simuladas e H2, então não validam o comportamento em PostgreSQL real. Mais detalhes em [docs/TESTES.md](docs/TESTES.md).

## Limitações e problemas conhecidos

| Item | Situação |
|---|---|
| `GET /api/profissionais` | Retorna erro 500 quando existe um profissional cadastrado (`ProfissionalController`), e o catálogo não carrega |
| E-mail já cadastrado | A API deveria responder `409`, mas responde `401`, e a tela mostra uma mensagem genérica |
| Validação do cadastro | A API aceita CPF inválido e telefone incompleto. A senha mínima é de 6 caracteres no cadastro e de 8 na redefinição |
| Health check sem SMTP | `/actuator/health` responde `DOWN` com a API funcionando. Localmente, use `MANAGEMENT_HEALTH_MAIL_ENABLED=false`. Em produção, configure o SMTP ou adote a mesma variável, para a plataforma não considerar o serviço fora do ar |
| Textos do site | Algumas páginas ainda descrevem recursos planejados, como pagamento e saque, como se estivessem disponíveis, e há palavras com caracteres quebrados |
| Fotos e identidade | O time aparece com iniciais, sem fotos |

## Documentação complementar

| Documento | Conteúdo |
|---|---|
| [docs/IMPLANTACAO.md](docs/IMPLANTACAO.md) | Hospedagem, variáveis de ambiente e verificação após o deploy |
| [docs/seguranca-autenticacao.md](docs/seguranca-autenticacao.md) | Regras de acesso por endpoint |
| [docs/TESTES.md](docs/TESTES.md) | Comandos e cobertura dos testes |
| [docs/api-pedidos-paginacao.md](docs/api-pedidos-paginacao.md) | Paginação das listagens de pedidos |
| [docs/mensagens-notificacoes-contato.md](docs/mensagens-notificacoes-contato.md) | Conversas, notificações e contato |
| [docs/rastreamento-e-identidade.md](docs/rastreamento-e-identidade.md) | Localização e verificação de identidade |
| [backend/AUTH_RECOVERY.md](backend/AUTH_RECOVERY.md) | Recuperação de senha e planos para login externo |
| [backend/FINANCEIRO.md](backend/FINANCEIRO.md) | Estado do módulo financeiro |
| [backend/PAYMENTS.md](backend/PAYMENTS.md) | Requisitos para integrar pagamentos |
