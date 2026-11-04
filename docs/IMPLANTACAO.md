# Implantação do TaskGO

Este guia prepara os serviços para hospedagem; não significa que o TaskGO já esteja publicado. Use ambientes separados para desenvolvimento, homologação e produção. Não reutilize senhas entre eles.

## Componentes e versões

- Frontend: HTML, CSS e JavaScript estáticos, sem etapa de build; pode ser publicado em qualquer hospedagem estática com HTTPS.
- Backend: Spring Boot 3.4.5, Java 17 e Maven 3.9+; porta configurável por `PORT` (padrão local 8080).
- Banco: PostgreSQL 14 ou superior, preferencialmente em rede privada, com backup e TLS do provedor.
- Há um `backend/Dockerfile` para plataformas que implantam contêineres. Docker é opcional.

## Desenvolvimento local

1. Crie um banco e um usuário PostgreSQL locais. Para iniciar apenas um PostgreSQL local com persistência Docker, defina `DB_PASSWORD` no terminal e execute `docker compose up -d postgres` na raiz. A porta é vinculada a `127.0.0.1`, não à rede pública.
2. No PowerShell, configure a conexão local e inicie o backend explicitamente no perfil dev:

   ```powershell
   $env:DB_URL='jdbc:postgresql://localhost:5432/taskgo_db'
   $env:DB_USERNAME='taskgo_app'
   $env:DB_PASSWORD='sua-senha-local'
   $env:TASKGO_CORS_ALLOWED_ORIGINS='http://localhost:5500'
   cd backend
   .\mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```

   Se o repositório não tiver Maven Wrapper, use `mvn spring-boot:run -Dspring-boot.run.profiles=dev`.
3. Sirva a raiz do frontend em `http://localhost:5500` (por exemplo, Live Server). No arquivo `js/taskgo-config.js`, configure `apiBaseUrl: 'http://localhost:8080'` para desenvolvimento local.
4. O perfil `dev` usa `ddl-auto=update` apenas para facilitar desenvolvimento. A senha continua obrigatória; não há senha padrão.

Para rodar manualmente o perfil dev sem Docker, configure `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` e `TASKGO_CORS_ALLOWED_ORIGINS` no ambiente antes da inicialização.

## Provisionar PostgreSQL de produção

Crie uma instância PostgreSQL no provedor, um banco `taskgo` e um usuário de aplicação dedicado. Use uma senha aleatória e longa gerada pelo gerenciador de segredos da hospedagem. Conceda ao usuário acesso somente ao banco e schema usados pela aplicação; não conceda privilégios de superusuário. Restrinja a rede de entrada ao backend e exija TLS quando o provedor suportar.

Exemplo para executar como administrador do PostgreSQL, substituindo os marcadores localmente (não cole uma senha real em repositório, ticket ou log):

```sql
CREATE ROLE taskgo_app LOGIN PASSWORD 'SUBSTITUA_POR_SEGREDO_FORTE';
CREATE DATABASE taskgo OWNER taskgo_app;
REVOKE ALL ON DATABASE taskgo FROM PUBLIC;
GRANT CONNECT, CREATE ON DATABASE taskgo TO taskgo_app;
```

Use no serviço da aplicação a URL JDBC privada do provedor, por exemplo `jdbc:postgresql://HOST_PRIVADO:5432/taskgo?sslmode=require`. Alguns provedores exigem parâmetros TLS próprios; siga a documentação deles. Não abra a porta do banco à internet pública.

Antes de atualizar banco com dados existentes, faça um backup e restaure-o em homologação. Flyway aplica `V1__initial_taskgo_schema.sql` automaticamente. A migração é aditiva (`CREATE/ADD IF NOT EXISTS`), não apaga dados e tenta reconhecer as tabelas que eram atualizadas pelo Hibernate. Revise o resultado de `V1` contra o esquema real do provedor em homologação, especialmente índices únicos e colunas herdadas, antes de produção. Nas próximas mudanças, crie novas migrações `V2__...sql`; não edite migrações já aplicadas. O perfil prod usa `ddl-auto=validate` e não altera o esquema por conta própria.

## Variáveis do backend

Configure-as no painel de segredos/variáveis da plataforma do backend. A aplicação sem perfil local segue o padrão seguro (banco/cors obrigatórios e validação do esquema); defina `SPRING_PROFILES_ACTIVE=prod` explicitamente em produção.

| Variável | Obrigatória | Exemplo/uso |
|---|---:|---|
| `SPRING_PROFILES_ACTIVE` | sim | `prod` |
| `DB_URL` | sim | `jdbc:postgresql://HOST_PRIVADO:5432/taskgo?sslmode=require` |
| `DB_USERNAME` | sim | `taskgo_app` |
| `DB_PASSWORD` | sim | Segredo do provedor; nunca registrar |
| `TASKGO_CORS_ALLOWED_ORIGINS` | sim | `https://taskgo.exemplo.com` (origens separadas por vírgula) |
| `PORT` | depende | Porta atribuída pelo provedor; padrão 8080 |
| `DB_POOL_MAX_SIZE` / `DB_POOL_MIN_IDLE` | não | 10 / 2 por padrão; ajuste ao limite do PostgreSQL |
| `SESSION_COOKIE_SAME_SITE` | não | `none` por padrão em produção; requer HTTPS |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM` | para recuperação por e-mail | Segredos SMTP; fora disso o fluxo de e-mail não é enviado |
| `PASSWORD_RESET_FRONTEND_URL` | para recuperação por e-mail | `https://taskgo.exemplo.com/#/recuperar` |
| `PAYMENTS_ENABLED`, `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`, `PAYMENTS_PUBLIC_BASE_URL` | somente ao integrar pagamentos | Mantenha `PAYMENTS_ENABLED=false` enquanto o provedor/webhook não estiver configurado |

`DB_URL`, `DB_USERNAME`, `DB_PASSWORD` e `TASKGO_CORS_ALLOWED_ORIGINS` não têm valores substitutos no perfil padrão/prod: ausências impedem o startup. O arquivo `.env.example` serve apenas como referência local e não é carregado automaticamente pelo Spring.

## Publicar o backend

1. Configure serviço, rede privada de banco e segredos acima. Defina `SPRING_PROFILES_ACTIVE=prod` e a porta fornecida por `PORT`.
2. Configure o comando de build como `mvn -B -DskipTests package` (ou use o `backend/Dockerfile`, cujo contexto de build é a pasta `backend`). Execute `mvn test` no CI antes de publicar.
3. Com o backup e a homologação aprovados, implante a aplicação. Flyway fará a migração e Hibernate validará o esquema. A aplicação escuta na porta configurada; deixe o proxy da plataforma terminar HTTPS.
4. Configure o health check em `/actuator/health`. Ele informa estado geral, sem detalhes de componentes. Veja logs do serviço no painel da plataforma; não habilite logs SQL nem imprima valores de variáveis.

## Publicar o frontend e configurar API

Publique a raiz do projeto como conteúdo estático (incluindo `index.html`, `css/`, `js/` e os recursos necessários de `assets/`). Configure HTTPS, cache para assets versionados e fallback/rewrite para `index.html` se o provedor precisar de rotas SPA. O frontend usa hash routes (`#/...`), então o navegador permanece na rota index.

A URL está centralizada em `js/taskgo-config.js`:

- Desenvolvimento local usa `http://localhost:8080` quando essa URL é configurada no arquivo central.
- Em produção, deixe `apiBaseUrl` vazio se o provedor servir o backend sob o mesmo domínio via proxy `/api` (recomendado para cookies), ou configure a origem HTTPS estável do backend, como `https://api.exemplo.com`.
- Esse arquivo é JavaScript público. Nele só pode haver URL pública; nunca coloque senha, token ou segredo.
- O modo de demonstração é aceito somente quando a origem é local; `?demo=1` não ativa contas ou dados fictícios em produção.

Se frontend e API tiverem origens distintas, cadastre **a origem exata do frontend** em `TASKGO_CORS_ALLOWED_ORIGINS` (sem caminho ou barra final). Cookies de sessão e CSRF já usam `credentials: include`; em produção são `Secure` e `SameSite=None`. Prefira subdomínios do mesmo domínio registrável ou proxy de mesma origem, pois navegadores podem bloquear cookies de terceiros mesmo com CORS correto. Não resolva esse bloqueio liberando `*`.

## Backup e recuperação

Configure backup automático e retenção no provedor. Antes de uma migração, crie um backup manual:

```sh
pg_dump --format=custom --no-owner --file=taskgo-backup.dump "$DATABASE_URL"
```

Para testar restauração em uma instância de homologação vazia:

```sh
pg_restore --no-owner --dbname="$DATABASE_URL_HOMOLOG" taskgo-backup.dump
```

Faça exercícios de recuperação periodicamente e restrinja o acesso aos arquivos de backup, que contêm dados pessoais.

## Verificação após deploy

1. Confirme `https://SEU_BACKEND/actuator/health` com status `UP`.
2. Acesse a home e `#/sobre`; tente uma chamada pública permitida e o fluxo de login/cadastro no domínio HTTPS.
3. No DevTools, confirme que pedidos vão à URL pública configurada, que cookies de sessão/CSRF são `Secure`, e que uma origem não cadastrada recebe bloqueio CORS.
4. Confirme nos logs que a migração Flyway terminou e Hibernate validou o esquema. Não compartilhe logs sem revisar dados pessoais.
5. Verifique banco, TLS, backup e restauração com o painel do provedor. A conectividade do banco e os domínios não podem ser atestados a partir deste repositório.

## Limites ainda dependentes da hospedagem

Não foram fornecidos provedor, domínio, instância PostgreSQL nem segredos, então não houve publicação nem teste contra serviços externos. Antes de uso real, valide a migração em uma cópia do banco atual; cadastre domínios e CORS definitivos; gere/roteie os segredos; configure TLS, SMTP e backups; e confirme limites de conexão. Se a senha `1234` já tiver sido usada em qualquer banco acessível externamente, substitua-a e revise usuários, conexões e logs desse ambiente.
