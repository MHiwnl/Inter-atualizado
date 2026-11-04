package com.taskgo.api;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(RecuperacaoSenhaController.class)
@Import(SecurityConfig.class)
class RecuperacaoSenhaControllerSecurityTest {
    @Autowired MockMvc mvc;
    @MockitoBean RecuperacaoSenhaService service;
    @MockitoBean UsuarioRepository usuarios;

    @Test void endpointPublicoAindaExigeCsrf()throws Exception{
        mvc.perform(post("/api/auth/recuperacao").contentType("application/json").content("{\"email\":\"ana@example.com\"}"))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/auth/recuperacao").with(csrf()).contentType("application/json").content("{\"email\":\"ana@example.com\"}"))
                .andExpect(status().isAccepted());
        verify(service).solicitar(eq("ana@example.com"),anyString());
    }
}
