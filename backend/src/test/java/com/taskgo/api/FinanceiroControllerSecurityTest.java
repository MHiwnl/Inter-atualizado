package com.taskgo.api;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(FinanceiroController.class)
@Import(SecurityConfig.class)
class FinanceiroControllerSecurityTest {
    @Autowired MockMvc mvc;
    @MockitoBean FinanceiroService service;
    @MockitoBean UsuarioRepository usuarios;

    @Test void carteiraExigeSessao() throws Exception {
        mvc.perform(get("/api/financeiro/carteira")).andExpect(status().isUnauthorized());
        verifyNoInteractions(service);
    }

    @Test void carteiraUsaIdDoUsuarioAutenticado() throws Exception {
        when(service.consultarCarteira(12L)).thenReturn(new FinanceiroService.CarteiraDto(BigDecimal.ZERO,BigDecimal.ZERO,BigDecimal.ZERO,"BRL"));
        TaskgoPrincipal principal=new TaskgoPrincipal(12L,"cliente@taskgo.com","Cliente","cliente",null);
        mvc.perform(get("/api/financeiro/carteira").with(user(principal))).andExpect(status().isOk());
        verify(service).consultarCarteira(12L);
        verify(service,never()).consultarCarteira(13L);
    }
}
