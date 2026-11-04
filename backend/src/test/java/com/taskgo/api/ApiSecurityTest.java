package com.taskgo.api;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PedidoContratadoController.class)
@Import({SecurityConfig.class, AuthController.class})
class ApiSecurityTest {
    @Autowired MockMvc mvc;
    @org.springframework.test.context.bean.override.mockito.MockitoBean PedidoService service;
    @org.springframework.test.context.bean.override.mockito.MockitoBean UsuarioRepository usuarios;
    @org.springframework.test.context.bean.override.mockito.MockitoBean PedidoRepository estimativas;
    @org.springframework.test.context.bean.override.mockito.MockitoBean PedidoContratadoRepository pedidos;
    @org.springframework.test.context.bean.override.mockito.MockitoBean MensagemRepository mensagens;
    @org.springframework.test.context.bean.override.mockito.MockitoBean NotificacaoRepository notificacoes;
    @org.springframework.test.context.bean.override.mockito.MockitoBean LoginAttemptLimiter limiter;
    @org.springframework.test.context.bean.override.mockito.MockitoBean LocalizacaoPedidoService localizacoes;

    @Test void pedidosPrivadosSemSessaoRetornam401() throws Exception {
        mvc.perform(get("/api/pedidos/contratados")).andExpect(status().isUnauthorized());
    }

    @Test void clienteNaoPodeConsultarOportunidadesDeProfissionais() throws Exception {
        TaskgoPrincipal cliente = new TaskgoPrincipal(12L, "cliente@taskgo.com", "Cliente", "cliente", null);
        mvc.perform(get("/api/pedidos/contratados/disponiveis").with(user(cliente)))
                .andExpect(status().isForbidden());
    }

    @Test void tokenCsrfPublicoDefineCookieParaFluxoDeLogin() throws Exception {
        mvc.perform(get("/api/auth/csrf"))
                .andExpect(status().isNoContent())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie().exists("XSRF-TOKEN"));
    }
}
