# TaskGO API

API TaskGO em Spring Boot 3.4.5 e Java 17.

## Configuração

O perfil padrão exige `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` e `TASKGO_CORS_ALLOWED_ORIGINS`; não há senha padrão. Para desenvolvimento local, ative explicitamente o perfil `dev`, que usa `localhost` e libera as origens Live Server locais.

No PowerShell:

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/taskgo_db"
$env:DB_USERNAME = "taskgo_app"
$env:DB_PASSWORD = "sua senha local"
$env:TASKGO_CORS_ALLOWED_ORIGINS = "http://localhost:5500"
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

É necessário Java 17 e Maven 3.9+. A migração Flyway inicializa/atualiza o esquema sem apagar dados; produção valida o esquema e não usa o update automático do Hibernate.

Para instruções completas de hospedagem, banco, variáveis, HTTPS, CORS, migração, publicação e backup, consulte [`docs/IMPLANTACAO.md`](../docs/IMPLANTACAO.md).

## Endpoint

`POST http://localhost:8080/api/pedidos/estimar`

Exemplo de JSON:

```json
{
  "servico": "Instalação de câmeras",
  "distancia": "10 km",
  "emailCliente": "cliente@exemplo.com"
}
```
