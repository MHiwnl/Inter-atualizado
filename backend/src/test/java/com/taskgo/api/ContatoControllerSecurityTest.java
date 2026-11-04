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

@WebMvcTest(ContatoController.class)
@Import(SecurityConfig.class)
class ContatoControllerSecurityTest {
    @Autowired MockMvc mvc;
    @MockitoBean ContatoService service;
    @MockitoBean UsuarioRepository usuarios;
    @Test void contatoPodeSerEnviadoSemLoginMasProtegidoPorCsrf() throws Exception {
        when(service.receber(any(),any())).thenReturn(new ContatoService.ContatoResponse("c1",1,"registrada","nao_configurado"));
        mvc.perform(post("/api/contatos").with(csrf()).contentType("application/json")
                .content("{\"nome\":\"Ana\",\"email\":\"ana@example.com\",\"assunto\":\"Suporte\",\"mensagem\":\"Ajuda\",\"website\":\"\"}"))
                .andExpect(status().isCreated());
        verify(service).receber(any(),any());
        mvc.perform(post("/api/contatos").contentType("application/json").content("{}"))
                .andExpect(status().isForbidden());
    }
}
