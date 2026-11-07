# Simplificar a execução do projeto

**Situação:** concluída em 2026-11-07
**Pedido do usuário:** rodar o projeto com Docker e localmente é complicado; deixar mais simples.

## Fazer
- [x] Um `docker-compose.yml` que sobe banco, API e site juntos, sem portas em conflito.
- [x] Site e API no mesmo endereço, por proxy, sem editar `js/taskgo-config.js`.
- [x] Script `iniciar.ps1`: cria o `.env` se faltar, para os contêineres antigos, sobe tudo e abre o navegador.
- [x] Script `parar.ps1`.
- [x] Reaproveitar o banco antigo (volume `taskgo-dev-db`), sem perder dados.
- [x] Reescrever as seções de execução do README.
- [x] Testar de verdade com o Docker Desktop aberto.
