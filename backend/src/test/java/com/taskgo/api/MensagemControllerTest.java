package com.taskgo.api;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.server.ResponseStatusException;

class MensagemControllerTest {
    private PedidoContratadoRepository pedidos;
    private MensagemRepository mensagens;
    private UsuarioRepository usuarios;
    private NotificacaoService notificacoes;
    private MensagemController controller;
    private TaskgoPrincipal cliente;
    private UsernamePasswordAuthenticationToken auth;

    @BeforeEach void setup(){
        pedidos=mock(PedidoContratadoRepository.class);mensagens=mock(MensagemRepository.class);usuarios=mock(UsuarioRepository.class);notificacoes=mock(NotificacaoService.class);controller=new MensagemController(pedidos,mensagens,usuarios,notificacoes);
        cliente=new TaskgoPrincipal(4L,"cliente@taskgo.com","Cliente","cliente",null);
        auth=UsernamePasswordAuthenticationToken.authenticated(cliente,null,cliente.getAuthorities());
    }
    private Pedido accepted(){Pedido p=new Pedido();p.setId("pedido-1");p.setClientEmail(cliente.email());p.setProEmail("pro@taskgo.com");p.setStatus("a_caminho");return p;}

    @Test void participanteCarregaHistoricoDoPedidoPersistido(){
        when(pedidos.findById("pedido-1")).thenReturn(Optional.of(accepted()));
        when(mensagens.findByPedidoIdOrderByCriadaEmAsc("pedido-1")).thenReturn(List.of());
        assertTrue(controller.listar("pedido-1",auth).isEmpty());
        verify(mensagens).findByPedidoIdOrderByCriadaEmAsc("pedido-1");
    }
    @Test void usuarioDeForaNaoLeNemEnviaMensagem(){
        TaskgoPrincipal stranger=new TaskgoPrincipal(8L,"intruso@taskgo.com","Intruso","cliente",null);
        var other=UsernamePasswordAuthenticationToken.authenticated(stranger,null,stranger.getAuthorities());
        when(pedidos.findById("pedido-1")).thenReturn(Optional.of(accepted()));
        assertEquals(403,assertThrows(ResponseStatusException.class,()->controller.listar("pedido-1",other)).getStatusCode().value());
        assertEquals(403,assertThrows(ResponseStatusException.class,()->controller.enviar("pedido-1",new MensagemController.NovaMensagem("key","texto"),other)).getStatusCode().value());
        verifyNoInteractions(mensagens);
    }
    @Test void envioSalvaMensagemEReenvioComMesmoIdempotencyKeyNaoDuplica(){
        when(pedidos.findById("pedido-1")).thenReturn(Optional.of(accepted()));
        Usuario pro=new Usuario();pro.setId(9L);pro.setEmail("pro@taskgo.com");when(usuarios.findByEmailIgnoreCase("pro@taskgo.com")).thenReturn(Optional.of(pro));
        Mensagem sent=new Mensagem("m1","pedido-1",4L,9L,"request-1","Olá",100L);
        when(mensagens.findByAutorIdAndClientMessageId(4L,"request-1")).thenReturn(Optional.empty(),Optional.of(sent));
        when(mensagens.save(any(Mensagem.class))).thenReturn(sent);
        var body=new MensagemController.NovaMensagem("request-1","Olá");
        var created=controller.enviar("pedido-1",body,auth);assertEquals("m1",created.id());assertFalse(created.automatica());
        assertEquals("m1",controller.enviar("pedido-1",body,auth).id());
        verify(mensagens,times(1)).save(any(Mensagem.class));
        verify(notificacoes,times(1)).criar(eq(9L),eq("pedido-1"),eq("mensagem"),anyString(),anyString(),eq("mensagem:m1"));
    }

    @Test void visualizarHistoricoMarcaComoLidasSomenteMensagensRecebidas(){
        when(pedidos.findById("pedido-1")).thenReturn(Optional.of(accepted()));
        Mensagem incoming=new Mensagem("m1","pedido-1",9L,4L,"k1","Oi",100L);
        Mensagem outgoing=new Mensagem("m2","pedido-1",4L,9L,"k2","Ola",101L);
        when(mensagens.findByPedidoIdOrderByCriadaEmAsc("pedido-1")).thenReturn(List.of(incoming,outgoing));
        var result=controller.listar("pedido-1",auth);
        assertNotNull(result.get(0).lidaEm());assertNull(result.get(1).lidaEm());verify(mensagens).saveAll(List.of(incoming));
    }
}
