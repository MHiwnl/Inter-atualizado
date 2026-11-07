# Área de uso separada do site e do painel

**Situação:** concluída em 2026-11-07
**Usar:** a skill `impeccable`.

## Decisões do usuário
- Site (landing) só apresenta; o link Contratar sai do menu.
- Área nova depois do login, com abas no topo: Contratar, Pedidos, Mensagens, Avaliações, Notificações e Carteira. O profissional tem Oportunidades, Atendimentos, Agenda e Desempenho no lugar de Contratar.
- Carteira: resgatar dinheiro, forma de pagamento e forma de resgate (banco ou PIX), como telas com aviso "ainda não disponível", sem salvar dados.
- Painel: só o perfil (dados, foto, segurança, exclusão).
- Depois do login, vai para a área nova; no primeiro acesso, vai para as configurações da conta.
- O botão "Voltar ao site" do painel leva para a área nova.

## Fazer
- [x] Rota nova `#/app/...` com cabeçalho e abas próprios.
- [x] Painel reduzido ao perfil.
- [x] Links antigos `#/painel/...` levam para a área nova.
- [x] Carteira com resgate e formas de pagamento e de resgate.
- [x] Destino após login e primeiro acesso.
- [x] Testar com contas reais, nos dois temas e no celular.
