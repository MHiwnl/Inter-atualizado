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

@WebMvcTest(PedidoContratadoController.class)
@Import({SecurityConfig.class, AuthController.class})
class OportunidadeControllerSecurityTest {
    @Autowired MockMvc mvc;
    @MockitoBean PedidoService service;
    @MockitoBean LocalizacaoPedidoService localizacoes;
    @MockitoBean UsuarioRepository usuarios;
    @MockitoBean PedidoRepository estimativas;
    @MockitoBean PedidoContratadoRepository pedidos;
    @MockitoBean MensagemRepository mensagens;
    @MockitoBean NotificacaoRepository notificacoes;
    @MockitoBean LoginAttemptLimiter limiter;

    @Test void oportunidadesExigemPerfilProfissionalAutenticado() throws Exception {
        TaskgoPrincipal cliente = new TaskgoPrincipal(1L, "cliente@taskgo.com", "Cliente", "cliente", null);
        mvc.perform(get("/api/pedidos/contratados/disponiveis").with(user(cliente))).andExpect(status().isForbidden());
        verifyNoInteractions(service);
    }

    @Test void oportunidadesSaoPaginadasERetornamSomenteDadosDaOferta() throws Exception {
        TaskgoPrincipal pro = new TaskgoPrincipal(2L, "pro@taskgo.com", "Pro", "profissional", "pro_2");
        Pedido pedido = new Pedido(); pedido.setId("o-1"); pedido.setService("eletrica"); pedido.setStatus("aguardando");
        pedido.setPrice(180d); pedido.setCreated(123L); pedido.setNotes("Tomada queimada, contato cliente@exemplo.com, 81999998888");
        pedido.setClientEmail("cliente@taskgo.com"); pedido.setClientId("55"); pedido.setAddress("Rua privada, 99");
        when(service.listarDisponiveis(eq("pro@taskgo.com"), isNull(), any()))
                .thenReturn(new PageImpl<>(List.of(pedido)));

        mvc.perform(get("/api/pedidos/contratados/disponiveis?page=0&size=1").with(user(pro)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].id").value("o-1"))
                .andExpect(jsonPath("$.content[0].notes").value(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("cliente@"))))
                .andExpect(jsonPath("$.content[0].clientEmail").doesNotExist())
                .andExpect(jsonPath("$.content[0].clientId").doesNotExist())
                .andExpect(jsonPath("$.content[0].address").doesNotExist())
                .andExpect(jsonPath("$.size").value(1));
        verify(service).listarDisponiveis(eq("pro@taskgo.com"), isNull(), any());
    }

    @Test void detalheDeOportunidadeAindaDisponivelTambemOcultaDadosDoCliente() throws Exception {
        TaskgoPrincipal pro = new TaskgoPrincipal(2L, "pro@taskgo.com", "Pro", "profissional", "pro_2");
        Pedido pedido = new Pedido(); pedido.setId("o-2"); pedido.setService("hidraulica");
        pedido.setStatus("aguardando"); pedido.setAddress("Rua privada, 99"); pedido.setClientEmail("cliente@taskgo.com");
        when(service.listarDoUsuario("pro@taskgo.com")).thenReturn(List.of());
        when(service.encontrarDisponivel("o-2")).thenReturn(java.util.Optional.of(pedido));

        mvc.perform(get("/api/pedidos/contratados/o-2").with(user(pro)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.id").value("o-2"))
                .andExpect(jsonPath("$.address").doesNotExist())
                .andExpect(jsonPath("$.clientEmail").doesNotExist());
    }
}
