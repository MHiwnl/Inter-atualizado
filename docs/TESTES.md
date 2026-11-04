# Testes automatizados do TaskGo

## Comandos

Na raiz, execute os testes JavaScript do frontend:

```powershell
node --test tests/*.test.cjs
```

Valide também a sintaxe dos arquivos de produção:

```powershell
Get-ChildItem js -Recurse -Filter '*.js' | ForEach-Object { node --check $_.FullName }
```

Para a API, com JDK 17 e Maven 3.9 ou superior:

```powershell
cd backend
mvn test
```

Para executar apenas o teste JPA isolado:

```powershell
mvn -Dtest=UsuarioRepositoryIntegrationTest test
```

A suíte Node e toda a suíte Maven são executadas por `.github/workflows/testes.yml` em cada push e pull request. A pipeline falha se qualquer teste falhar e também verifica a sintaxe JavaScript.

## Cobertura existente

O backend usa JUnit 5, Mockito, Spring Boot Test, MockMvc e Spring Security Test via `spring-boot-starter-test` e `spring-security-test`. Os testes atuais cobrem autenticação e sessão, segurança HTTP, CORS, pedidos e oportunidades, mensagens, notificações, localização, contatos, recuperação de senha e regras do financeiro. Há testes unitários de serviços e testes MVC que exercitam endpoints com dependências simuladas.

`UsuarioRepositoryIntegrationTest` usa H2 em memória, isolado por execução, para verificar gravação e consulta JPA e rejeição de e-mail duplicado. O frontend não usa framework de componentes; os testes usam `node:test` e `vm`, sem dependências adicionais, para validar configuração da API, sanitização do armazenamento e falhas ao persistir pedidos e mensagens.

## Limites conhecidos

- O teste H2 não valida compatibilidade com PostgreSQL, migrações Flyway no PostgreSQL nem persistência de todos os agregados. É necessário adicionar uma suíte PostgreSQL isolada antes de afirmar esses resultados.
- Não há suíte Playwright/E2E configurada; fluxos completos no navegador e integração conjunta frontend/API não foram validados.
- Pagamentos e login social não possuem integração real habilitada. Os testes locais não representam cobranças, webhooks ou autenticação de provedores.
- E-mail de recuperação não foi exercitado contra um servidor de captura. Os testes existentes verificam regras locais e controllers isoladamente.
- Não há relatório de cobertura configurado; a porcentagem de cobertura não foi medida.

Execute os testes com dados fictícios. Não configure credenciais de produção como banco de teste.
