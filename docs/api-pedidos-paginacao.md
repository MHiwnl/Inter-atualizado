# Listagens de pedidos

`GET /api/pedidos` lista apenas estimativas do cliente autenticado. Profissionais recebem `403`; requisições sem sessão recebem `401`. O filtro `servico` é opcional. Parâmetros: `page` (zero-based, padrão `0`), `size` (padrão `20`, máximo `100`) e `sort` (`id,asc`, `id,desc`, `servico,asc` ou `servico,desc`). A ordenação padrão é `id,desc`.

A resposta tem `content`, `page`, `size`, `totalElements`, `totalPages`, `first` e `last`. Cada estimativa contém somente `id`, `servico` e `distancia`; `emailCliente` nunca é serializado. Cliente, filtro e paginação são combinados na consulta ao banco.

`GET /api/pedidos/contratados/disponiveis` é a listagem separada de oportunidades e está disponível somente para profissionais autenticados. Aceita os mesmos parâmetros de paginação, `servico` opcional e ordenação por `created` ou `price`. Retorna a mesma estrutura paginada, com campos de oferta (`id`, `service`, `notes`, `created`, `status`, `price`, `sched`), removendo e-mail e telefone que apareçam na descrição. Endereço, identificadores e contato do cliente não são incluídos antes do aceite. A interface de oportunidades foi adaptada para navegar pelas páginas e informar que o endereço será revelado após o aceite.

`GET /api/pedidos/contratados/{id}` retorna DTO de oportunidade minimizado quando o pedido ainda aguarda aceite; consultas por profissionais continuam limitadas ao estado `aguardando`. Para pedidos vinculados, a consulta permanece limitada a cliente ou profissional associado ao pedido.

O modelo atual não possui papel de administrador, portanto não há listagem administrativa nem acesso geral a ser concedido. Esse papel precisa ser definido no modelo e nas permissões antes de criar uma rota administrativa.

As duas consultas usam `Pageable` no Spring Data; página negativa, tamanho fora de `1..100`, ordenação inválida ou campo não permitido retornam `400`. Nenhuma migração de banco é necessária.
