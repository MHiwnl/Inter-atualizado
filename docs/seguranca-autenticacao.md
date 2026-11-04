# Autenticação e autorização do TaskGo

## Diagnóstico e decisão

Antes da alteração, o cadastro já aplicava BCrypt, mas o JavaScript copiava a senha para objetos em `localStorage`; o login não criava uma identidade validada em requisições seguintes. A API não tinha Spring Security, e perfil, dados da conta e pedidos aceitavam e-mail informado pelo navegador como identidade. Também havia credenciais demonstrativas no código.

O TaskGo agora usa sessão HTTP do Spring Security. O navegador recebe o cookie `JSESSIONID` com `HttpOnly`, `SameSite=Lax` e `Secure` configurável para HTTPS. Operações que alteram dados exigem token CSRF no cabeçalho `X-XSRF-TOKEN`, obtido em `GET /api/auth/csrf`. A identidade vem do contexto de segurança do servidor, e os DTOs de autenticação não incluem senha, hash ou dados extras da entidade.

## Acesso aos endpoints

| Endpoint | Acesso e regra |
| --- | --- |
| `GET /api/auth/csrf` | Público; entrega o token CSRF para iniciar login/cadastro. |
| `POST /api/auth/registrar` | Público; cria conta cliente ou profissional, aplica BCrypt e inicia sessão. Não aceita papel administrativo. |
| `POST /api/auth/login` | Público; BCrypt, mensagem genérica e limite de 10 falhas por IP a cada 5 minutos. |
| `GET /api/auth/sessao` | Sessão autenticada; devolve somente os dados de perfil necessários. |
| `POST /api/auth/logout` | Sessão autenticada e CSRF; invalida a sessão. |
| `PUT /api/auth/perfil`, `GET/PUT /api/auth/dados`, `PUT /api/auth/senha`, `DELETE /api/auth/conta` | Sessão autenticada; opera somente na conta da sessão. Troca de senha e exclusão exigem a senha atual. |
| `POST /api/pedidos/estimar` | Público para permitir estimativas antes do login; o e-mail do corpo é descartado. |
| `GET /api/pedidos` | Sessão autenticada; lista apenas estimativas associadas ao e-mail da sessão. |
| `POST /api/pedidos/contratados` | Cliente autenticado; e-mail e ID do cliente são substituídos pelos valores da sessão. Profissional pré-selecionado é validado no banco. |
| `GET /api/pedidos/contratados`, `GET /{id}`, `PUT /{id}` | Sessão autenticada e propriedade do pedido; profissional pode consultar oportunidades ainda disponíveis. |
| `GET /api/pedidos/contratados/disponiveis`, `POST /{id}/aceitar` | Apenas profissional autenticado; aceite também valida o papel no banco e é atômico para pedidos ainda disponíveis. |
| `GET /actuator/health` | Público para verificação técnica. |
| Demais endpoints | Exigem autenticação por padrão. |

Não há funções administrativas no modelo de usuário atual. A troca do tipo de conta e do `proId` não é permitida pela edição de perfil.

## Frontend e dados antigos

O JavaScript não persiste senha, hash, token nem indicador local de sessão. Ao abrir o site consulta `GET /api/auth/sessao`; logout invalida a sessão no backend e limpa os dados privados em memória. Cookies são enviados com `credentials: include`, e o wrapper de requisições carrega CSRF nos métodos de alteração.

O `Store` remove campos de senha e sessão quando lê dados antigos do navegador e grava a versão sanitizada. Isso não apaga senhas em texto puro que já tenham sido gravadas em versões anteriores em outros dispositivos; a pessoa deve limpar os dados locais do site nesses navegadores. Contas antigas no banco com senha em texto puro não são convertidas nem aceitas como hash: precisam redefinir a senha por um processo administrativo confiável.

## Execução e implantação

Para desenvolvimento, ative explicitamente o perfil `dev` e configure `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` e `TASKGO_CORS_ALLOWED_ORIGINS`. Configure o endereço local do backend em `js/taskgo-config.js`; produção usa a URL HTTPS definida nesse mesmo arquivo ou um proxy same-origin `/api`.

Para produção, ative `SPRING_PROFILES_ACTIVE=prod` e forneça URL JDBC, usuário e senha por variáveis/segredos da plataforma. CORS não tem origem padrão fora dos testes e deve listar os domínios autorizados. Cookies ficam `Secure` e `SameSite=None` em produção, compatíveis com HTTPS e frontend/API em origens diferentes. Instruções reproduzíveis estão em [`IMPLANTACAO.md`](IMPLANTACAO.md).

## Limitações operacionais antes de produção

- O limitador de login é em memória e por endereço IP; em múltiplas instâncias, mova-o para armazenamento compartilhado ou aplique rate limiting no gateway. Se houver proxy, configure o tratamento de IP confiável antes de usar o cabeçalho encaminhado.
- Sirva o frontend e a API por HTTPS, restrinja CORS às origens reais e use credenciais de banco próprias por ambiente.
- A recuperação de senha só envia e-mail se SMTP e URL HTTPS do frontend estiverem configurados. Teste o fluxo ponta a ponta no provedor de e-mail antes de depender dele.
- Senhas legadas em texto puro não são convertidas nem aceitas como hash; contas desse tipo exigem redefinição confiável.
- Flyway aplica alterações versionadas; o perfil prod usa `ddl-auto=validate`. A migração inicial deve ser validada contra uma cópia do banco real antes do primeiro deploy.
