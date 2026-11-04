package com.taskgo.api;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PedidoController.class)
@Import({SecurityConfig.class, AuthController.class})
class PedidoControllerSecurityTest {
    @Autowired MockMvc mvc;
    @MockitoBean PedidoRepository repository;
    @MockitoBean PedidoService service;
    @MockitoBean UsuarioRepository usuarios;
    @MockitoBean PedidoContratadoRepository pedidos;
    @MockitoBean MensagemRepository mensagens;
    @MockitoBean NotificacaoRepository notificacoes;
    @MockitoBean LoginAttemptLimiter limiter;

    @Test void estimativasExigemAutenticacao() throws Exception {
        mvc.perform(get("/api/pedidos")).andExpect(status().isUnauthorized());
        verifyNoInteractions(repository);
    }

    @Test void clienteRecebeSomentePaginaDasPropriasEstimativasSemEmail() throws Exception {
        TaskgoPrincipal cliente = new TaskgoPrincipal(7L, "dona@taskgo.com", "Dona", "cliente", null);
        PedidoEstimativa estimativa = new PedidoEstimativa(); estimativa.setId(42L);
        estimativa.setServico("eletrica"); estimativa.setDistancia("3 km"); estimativa.setEmailCliente("dona@taskgo.com");
        when(repository.findByEmailClienteIgnoreCase(eq("dona@taskgo.com"), any()))
                .thenReturn(new PageImpl<>(List.of(estimativa)));

        mvc.perform(get("/api/pedidos?page=0&size=1&sort=id,desc").with(user(cliente)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].id").value(42))
                .andExpect(jsonPath("$.content[0].servico").value("eletrica"))
                .andExpect(jsonPath("$.content[0].emailCliente").doesNotExist())
                .andExpect(jsonPath("$.page").value(0)).andExpect(jsonPath("$.size").value(1));
        verify(repository).findByEmailClienteIgnoreCase(eq("dona@taskgo.com"), any());
    }

    @Test void profissionalNaoConsultaEstimativasDeClientes() throws Exception {
        TaskgoPrincipal profissional = new TaskgoPrincipal(8L, "pro@taskgo.com", "Pro", "profissional", "pro_8");
        mvc.perform(get("/api/pedidos").with(user(profissional))).andExpect(status().isForbidden());
        verifyNoInteractions(repository);
    }

    @Test void rejeitaTamanhoEOrdenacaoForaDaListaPermitida() throws Exception {
        TaskgoPrincipal cliente = new TaskgoPrincipal(7L, "dona@taskgo.com", "Dona", "cliente", null);
        mvc.perform(get("/api/pedidos?size=101").with(user(cliente))).andExpect(status().isBadRequest());
        mvc.perform(get("/api/pedidos?sort=emailCliente,asc").with(user(cliente))).andExpect(status().isBadRequest());
        verifyNoInteractions(repository);
    }
}
