# Rastreamento e verificacao de identidade

## Localizacao do pedido

- O profissional inicia o compartilhamento explicitamente a partir de um pedido no estado `a_caminho` e concede a permissao do navegador.
- O navegador envia latitude, longitude, precisao e horario da medicao. O backend vincula a posicao a conta autenticada e ao pedido atribuido.
- O servidor aceita somente coordenadas validas, medicoes recentes e atualizacoes com intervalo minimo de 10 segundos.
- A tabela `pedido_localizacoes` guarda somente a posicao mais recente de cada pedido. A linha e removida quando o pedido sai de `a_caminho` ou quando o profissional encerra o compartilhamento.
- Cliente e profissional do pedido podem consultar a ultima posicao enquanto o pedido estiver `a_caminho`. Outros usuarios recebem proibicao.
- O mapa mostra o ponto GPS e a precisao informada pelo dispositivo. O sistema nao calcula rota, distancia percorrida ou ETA, pois o pedido ainda nao possui coordenadas de destino nem provedor de roteamento.
- A geolocalizacao do navegador depende de permissao e contexto seguro. Em producao, publique o frontend em HTTPS.
- O mapa usa tiles do OpenStreetMap com atribuicao visivel. O servidor publico de tiles nao oferece SLA; configure um provedor de tiles adequado antes de uso comercial ou volume significativo.

## Verificacao de identidade

A verificacao documental/facial permanece indisponivel. O projeto nao possui conta, credenciais, contrato, endpoints autenticados ou webhook configurados para um provedor. O fluxo anterior que abria a camera e aprovava apos temporizadores foi removido; a interface nao captura imagens nem marca usuarios como verificados.

Antes de integrar, selecione um provedor contratado que confirme suporte a documento brasileiro, comparacao facial com o documento, vivacidade quando necessaria, callback autenticado e politica de retencao compatível. A idwall e uma candidata a avaliacao, mas a documentacao publica consultada nao confirma por si so que o contrato do TaskGo contem todos esses recursos. Nao integrar ou aprovar usuarios ate que o produto contratado, o fluxo de webhook e as credenciais sejam confirmados.

Nao armazenar imagens de documentos ou faces no TaskGo se o provedor puder processa-las sem duplicacao. Registrar somente referencias e estados necessarios, com acesso restrito e prazo de exclusao definido antes de habilitar o fluxo.

## Limitacoes

O GPS do dispositivo e uma estimativa que pode ser imprecisa ou adulterada; nao comprova a presenca fisica da pessoa. O compartilhamento depende de o navegador permanecer aberto e autorizado. Uma localizacao antiga e identificada como desatualizada; nenhum ponto substituto e gerado.
