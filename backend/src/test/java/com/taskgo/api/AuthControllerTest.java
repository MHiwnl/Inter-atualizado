package com.taskgo.api;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Map;
import java.util.List;
import java.util.Optional;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

class AuthControllerTest {
    private UsuarioRepository usuarios;
    private PedidoRepository estimativas;
    private PedidoContratadoRepository pedidos;
    private MensagemRepository mensagens;
    private NotificacaoRepository notificacoes;
    private AuthController controller;
    private final PasswordEncoder encoder = new BCryptPasswordEncoder();

    @BeforeEach void setup() {
        usuarios=mock(UsuarioRepository.class); estimativas=mock(PedidoRepository.class); pedidos=mock(PedidoContratadoRepository.class); mensagens=mock(MensagemRepository.class);notificacoes=mock(NotificacaoRepository.class);
        controller=new AuthController(usuarios,estimativas,pedidos,mensagens,notificacoes,encoder,new LoginAttemptLimiter());
    }

    @AfterEach void limparContextoDeSeguranca(){org.springframework.security.core.context.SecurityContextHolder.clearContext();}

    @Test void cadastroArmazenaSomenteHashEAbreSessaoSemExporHash() {
        Usuario novo=new Usuario(); novo.setNome("Ana"); novo.setEmail(" ANA@TASKGO.COM "); novo.setTipo("cliente"); novo.setSenha("senha123");
        novo.setService("marido");
        when(usuarios.existsByEmailIgnoreCase("ana@taskgo.com")).thenReturn(false);
        when(usuarios.save(novo)).thenAnswer(inv->{Usuario u=inv.getArgument(0);u.setId(9L);return u;});
        var response=controller.registrar(novo,new MockHttpServletRequest());
        assertEquals(9L,response.id()); assertEquals("ana@taskgo.com",response.email());
        assertFalse(response.toString().contains("senha"));
        assertNotEquals("senha123",novo.getSenha()); assertTrue(encoder.matches("senha123",novo.getSenha()));
        assertNull(novo.getService());
        assertNotNull(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication());
    }

    @Test void loginValidaCredencialERejeitaSenhaIncorreta() {
        Usuario existente=new Usuario(); existente.setId(1L); existente.setEmail("a@b.com"); existente.setNome("Ana"); existente.setTipo("cliente"); existente.setSenha(encoder.encode("senha123"));
        when(usuarios.findByEmailIgnoreCase("A@B.COM")).thenReturn(Optional.of(existente));
        Usuario login=new Usuario(); login.setEmail("A@B.COM"); login.setSenha("senha123");
        var ok=controller.login(login,new MockHttpServletRequest());
        assertEquals(200,ok.getStatusCode().value());
        assertFalse(ok.getBody().toString().contains(existente.getSenha()));
        login.setSenha("incorreta");
        assertEquals(401,controller.login(login,new MockHttpServletRequest()).getStatusCode().value());
    }

    @Test void loginAplicaLimiteDeTentativasPorEndereco() {
        Usuario login=new Usuario(); login.setEmail("ausente@taskgo.com"); login.setSenha("senha123");
        when(usuarios.findByEmailIgnoreCase("ausente@taskgo.com")).thenReturn(Optional.empty());
        for(int i=0;i<10;i++) assertEquals(401,controller.login(login,new MockHttpServletRequest()).getStatusCode().value());
        assertEquals(429,controller.login(login,new MockHttpServletRequest()).getStatusCode().value());
    }

    @Test void perfilEDadosUsamSomenteUsuarioDaSessao() {
        Usuario dono=new Usuario(); dono.setId(7L); dono.setEmail("dono@taskgo.com"); dono.setTipo("cliente");
        when(usuarios.findById(7L)).thenReturn(Optional.of(dono)); when(usuarios.save(dono)).thenReturn(dono);
        var p=new TaskgoPrincipal(7L,dono.getEmail(),"Dono","cliente",null);
        var auth=UsernamePasswordAuthenticationToken.authenticated(p,null,p.getAuthorities());
        Usuario update=new Usuario(); update.setEmail("vitima@taskgo.com"); update.setNome("Nome atualizado"); update.setTipo("administrador"); update.setProId("pro-de-outra-conta"); update.setBirth("1998-04-21");
        controller.atualizarPerfil(update,auth);
        assertEquals("dono@taskgo.com",dono.getEmail()); assertEquals("cliente",dono.getTipo()); assertNull(dono.getProId());
        assertEquals("1998-04-21",dono.getBirth());
        controller.salvarDados(new AuthController.DadosContaRequest(Map.of("notifications",List.of())),auth);
        assertEquals(Map.of(),controller.obterDados(auth));
        verify(usuarios,never()).findByEmailIgnoreCase("vitima@taskgo.com");
    }

    @Test void atualizarSenhaExigeSenhaAtual() {
        Usuario dono=new Usuario(); dono.setId(2L); dono.setEmail("dono@taskgo.com"); dono.setSenha(encoder.encode("antiga123"));
        when(usuarios.findById(2L)).thenReturn(Optional.of(dono)); when(usuarios.save(dono)).thenReturn(dono);
        var p=new TaskgoPrincipal(2L,dono.getEmail(),"Dono","cliente",null);
        var auth=UsernamePasswordAuthenticationToken.authenticated(p,null,p.getAuthorities());
        assertThrows(ResponseStatusException.class,()->controller.atualizarSenha(new AuthController.AlterarSenhaRequest("errada123","nova123"),auth));
        controller.atualizarSenha(new AuthController.AlterarSenhaRequest("antiga123","nova123"),auth);
        assertTrue(encoder.matches("nova123",dono.getSenha()));
        assertEquals(1,dono.getCredentialVersion());
    }

    @Test void excluirContaApagaMensagensDosPedidosAssociados() {
        Usuario dono=new Usuario();dono.setId(3L);dono.setEmail("dono@taskgo.com");dono.setNome("Dono");dono.setTipo("cliente");dono.setSenha(encoder.encode("senha123"));
        Pedido pedido=new Pedido();pedido.setId("pedido-1");pedido.setClientEmail(dono.getEmail());
        when(usuarios.findById(3L)).thenReturn(Optional.of(dono));
        when(pedidos.findByClientEmailIgnoreCaseOrProEmailIgnoreCaseOrderByCreatedDesc(dono.getEmail(),dono.getEmail())).thenReturn(List.of(pedido));
        var principal=new TaskgoPrincipal(3L,dono.getEmail(),dono.getNome(),"cliente",null);
        var auth=UsernamePasswordAuthenticationToken.authenticated(principal,null,principal.getAuthorities());
        controller.excluirConta(new AuthController.ExcluirContaRequest("senha123"),auth,new MockHttpServletRequest());
        verify(mensagens).deleteByPedidoIdIn(List.of("pedido-1"));
        verify(pedidos).deleteByClientEmailIgnoreCaseOrProEmailIgnoreCase(dono.getEmail(),dono.getEmail());
        verify(usuarios).delete(dono);
    }
}
