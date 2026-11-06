# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Público prioritário: profissionais autônomos de serviços locais.** São pessoas que querem encontrar pedidos e organizar seus atendimentos. Sem eles não há oferta para os clientes, então as decisões de produto os atendem primeiro.

**Público secundário: clientes** que precisam contratar um serviço local, como elétrica, hidráulica, limpeza ou reforma, e querem encontrar um profissional e acompanhar o atendimento.

**Público de avaliação do projeto:** a TaskGO nasceu como projeto de estudantes da UNIBRA, em Recife. O papel de uma banca avaliadora ainda não foi definido; ver decisões em aberto.

## Product Purpose

A TaskGO aproxima profissionais autônomos e pessoas que precisam de serviços locais. O sucesso é um profissional conseguir receber pedidos, atender e construir reputação, e um cliente conseguir encontrar quem faça o serviço e acompanhar o atendimento.

## Positioning

**Tudo em um só fluxo.** Hoje, indicação, conversa, combinação de preço e acompanhamento ficam espalhados entre canais diferentes. A TaskGO reúne busca, referência de preço, conversa e acompanhamento do atendimento no mesmo lugar.

## Operating Context

- Profissionais e clientes combinam o serviço e acompanham o pedido, incluindo o uso da interface no celular.
- O profissional escolhe os pedidos que aceita. O contato e o endereço do cliente só aparecem depois do aceite.
- A localização é compartilhada com consentimento do profissional durante um atendimento a caminho.

## Capabilities and Constraints

**Estágio:** MVP em desenvolvimento, ainda não aberto ao público.

**Regra de comunicação (confirmada):** o site pode apresentar a visão do produto como ele ficará pronto, desde que deixe claro que é uma proposta em desenvolvimento. Nenhuma tela pode levar alguém a acreditar que um recurso planejado já funciona de verdade.

**Funciona no repositório:** cadastro de cliente e profissional, login, sessão, perfil, pedidos, aceite, status, cancelamento, avaliação, oportunidades, conversa por pedido, notificações dentro do aplicativo, formulário de contato e última localização compartilhada.

**Parcial:** recuperação de senha, que depende de SMTP configurado; e carteira, extrato e solicitação de saque, sem crédito nem repasse real.

**Não existe:** pagamento real, checkout, assinatura Plus, login com Google e Apple, verificação de identidade, rota e previsão de chegada, notificações por e-mail, push ou SMS, e papel de administrador.

**Modo demonstração:** `?demo=1`, somente em localhost, usa dados fictícios com aviso na tela e não se mistura às contas reais.

**Categorias previstas:** Elétrica & Energia, Ar-condicionado, Hidráulica, Limpeza & Diarista, Pintura, Montagem de Móveis, Pedreiro & Reformas, Jardinagem, Marido de Aluguel, Eletrodomésticos, Frete & Mudança, Dedetização, Informática & Redes e Câmeras & Segurança.

**Decisões em aberto:**

- Valores e condições dos planos. Os preços atuais só aparecem no modo demonstração e não estão confirmados.
- Provedor de pagamento.
- Abrangência depois de Recife.
- Se a avaliação na UNIBRA influencia as prioridades do site.

## Brand Commitments

- **Nome:** TaskGO.
- **Origem:** projeto criado em 2026 por estudantes da UNIBRA, em Recife.
- **Valores publicados no site:** transparência, segurança, respeito ao trabalho e escuta ativa.
- **Cores:** as cores atuais do site são um compromisso definido pelo responsável pelo produto e não devem mudar. Os valores estão em `css/base.css`.
- **Idioma:** português do Brasil.

## Evidence on Hand

- Dados atuais publicados no site: 0 clientes e 0 profissionais cadastrados.
- Vídeos em `assets/`. O vídeo `8853466-hd_1920_1080_24fps.mp4` é usado no início do site.
- Time fundador listado em `js/pages/sobre.js`, ainda sem fotos reais.

**Não existe e não pode ser inventado:** clientes, profissionais em atividade, depoimentos, logos de parceiros, avaliações reais, métricas de resultado ou imprensa. Pessoas de banco de imagens não podem representar integrantes do time nem profissionais cadastrados.

## Product Principles

1. **O profissional vem primeiro.** Quando as necessidades dos dois públicos competirem, a decisão parte do que faz o profissional conseguir trabalhar.
2. **Um só fluxo.** Cada etapa do atendimento deve continuar no mesmo lugar, sem mandar a pessoa para outros canais.
3. **Visão com honestidade.** Mostrar para onde o produto vai é permitido; fazer um recurso planejado parecer disponível, não.
4. **Só prova real.** Números, nomes e resultados aparecem apenas quando existirem de verdade.
