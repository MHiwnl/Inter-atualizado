# Recuperação de conta e login externo

## Auditoria

O TaskGo já autentica e-mail/senha com BCrypt e guarda o contexto em sessão HTTP. Não existia fluxo de recuperação, SMTP nem OAuth. O link “Esqueci a senha” apontava para a Ajuda e Google/Apple eram apenas botões com mensagens. O limitador de login existente é em memória e por IP.

## Recuperação implementada

- `POST /api/auth/recuperacao` recebe `{ "email": "..." }` e sempre retorna a mesma mensagem `202` para e-mails válidos, exista ou não uma conta elegível. Há limite de 5 pedidos por IP a cada 15 minutos.
- `POST /api/auth/recuperacao/redefinir` recebe `{ "token": "...", "novaSenha": "...", "confirmarSenha": "..." }`. Senha mínima: 8 caracteres. Token expira em 30 minutos, é aleatório, enviado somente ao e-mail salvo na conta e armazenado no banco apenas como SHA-256. Após redefinir, ele é invalidado.
- `credential_version` é incrementada ao trocar a senha. O filtro de sessão compara essa versão com o banco e encerra sessões antigas.
- Ambos os POSTs exigem CSRF. A tela web solicita o cookie CSRF e envia o cabeçalho esperado. A URL de redefinição usa fragmento do frontend (`#/recuperar?token=...`) para o token não ser enviado na requisição HTTP da página.

O Hibernate atualiza o esquema sem apagar dados (`ddl-auto=update`): tabela aditiva `tokens_recuperacao_senha` e coluna `usuarios.credential_version` com valor inicial zero. Não havia ferramenta de migração versionada no backend.

## Configurar e testar e-mail local

Defina as variáveis no ambiente do processo Spring; não as coloque no JavaScript ou no repositório:

```text
SMTP_HOST=<host SMTP de teste>
SMTP_PORT=587
SMTP_USERNAME=<usuário SMTP>
SMTP_PASSWORD=<senha SMTP ou senha de aplicativo>
SMTP_FROM=<remetente autorizado>
SMTP_AUTH=true
SMTP_STARTTLS=true
SMTP_STARTTLS_REQUIRED=true
PASSWORD_RESET_FRONTEND_URL=http://localhost:5500/#/recuperar
```

Use uma caixa de teste/sandbox SMTP. Sem host, remetente e URL de frontend configurados, o endpoint continua respondendo genericamente e não cria token nem afirma que enviou e-mail. O token nunca é retornado pela API nem registrado em logs.

Para validar, inicie PostgreSQL e o backend (`DB_PASSWORD` e banco `taskgo_db` configurados), sirva o frontend em `localhost:5500`, cadastre uma conta de teste e use “Esqueci a senha”. Abra o link recebido antes de 30 minutos, redefina a senha e entre novamente. A integração SMTP não foi testada ponta a ponta neste ambiente porque não há credenciais configuradas.

O limitador é local ao processo; ambiente com mais de uma instância deve usar um armazenamento compartilhado e também impor limites no proxy/API gateway.

## Login Google e Apple

Os botões permanecem explicitamente indisponíveis. Ainda não há endpoints OAuth, vínculos de identidade, fluxo de criação de sessão nem configuração de provedor implementados; configurar credenciais sozinho não habilitará esses botões.

Para Google, a implementação futura deve usar OAuth 2.0 Authorization Code + OpenID Connect no backend, callback HTTPS registrado no projeto Google e validar assinatura, `iss`, `aud`, expiração e usar `sub` como identificador estável. A documentação oficial recomenda validar o ID token no servidor e não usar e-mail como identificador único: [Google OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect).

Para Apple, é necessário configurar Sign in with Apple no Apple Developer, Service ID, domínio e URL de retorno HTTPS, Team ID, Key ID e chave privada para gerar o client secret assinado; a chave nunca deve ir ao frontend. O callback `form_post` também exige política de cookie compatível com HTTPS. A validação deve usar as chaves públicas da Apple e conferir emissor, audiência, validade, `state` e `nonce`: [Apple Sign in REST API](https://developer.apple.com/documentation/signinwithapplerestapi) e [configuração do ambiente](https://developer.apple.com/documentation/signinwithapple/configuring-your-environment-for-sign-in-with-apple).

Não vincular contas automaticamente apenas pelo e-mail. O fluxo futuro deve associar `provider + subject` em tabela com restrição única e exigir prova da sessão/senha para vincular a uma conta TaskGo existente. A implementação atual ainda não inclui essa tabela nem os fluxos Google/Apple.

Em produção, use HTTPS e `SESSION_COOKIE_SECURE=true`. O cookie de sessão atual é `HttpOnly`, `SameSite=Lax`; qualquer suporte futuro ao callback Apple `form_post` precisa ser projetado e testado com cookie `SameSite=None; Secure` e origem HTTPS.
