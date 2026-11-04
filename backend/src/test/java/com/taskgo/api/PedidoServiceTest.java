package com.taskgo.api;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class PedidoServiceTest {
    private PedidoContratadoRepository repository;
    private PedidoService service;

    @BeforeEach void setup() {
        repository = mock(PedidoContratadoRepository.class);
        service = new PedidoService(repository);
    }

    private Pedido pedido(String status) {
        Pedido p = new Pedido(); p.setId("o_123"); p.setClientEmail("cliente@taskgo.com");
        p.setProEmail("pro@taskgo.com"); p.setService("eletrica"); p.setPrice(150.0);
        p.setStatus(status); p.setAddress("Rua A, 10"); p.setPaid("pix"); return p;
    }

    @Test void criarPersistePedidoComOsDadosInformados() {
        Pedido novo = pedido("aguardando");
        when(repository.existsById(novo.getId())).thenReturn(false);
        when(repository.save(novo)).thenReturn(novo);
        assertSame(novo, service.criar(novo));
        verify(repository).save(novo);
    }

    @Test void criarRedefineEstadoDoPedidoComValoresConfiaveisDoServidor() {
        Pedido novo=pedido("concluido");novo.setPaid("confirmado");novo.setAcceptedAt(1L);novo.setCompletedAt(2L);
        when(repository.existsById(novo.getId())).thenReturn(false);when(repository.save(novo)).thenReturn(novo);
        service.criar(novo);
        assertEquals("aguardando",novo.getStatus());assertNull(novo.getPaid());assertNull(novo.getAcceptedAt());assertNull(novo.getCompletedAt());
        assertNotNull(novo.getCreated());
    }

    @Test void criarRejeitaDadosObrigatoriosAusentesEDuplicados() {
        assertThrows(ResponseStatusException.class, () -> service.criar(new Pedido()));
        Pedido duplicado = pedido("aguardando"); when(repository.existsById(duplicado.getId())).thenReturn(true);
        assertThrows(ResponseStatusException.class, () -> service.criar(duplicado));
        verify(repository, never()).save(any());
    }

    @Test void listarFiltraPedidosPeloEmailDeClienteOuProfissional() {
        when(repository.findByClientEmailIgnoreCaseOrProEmailIgnoreCaseOrderByCreatedDesc("a@b.com", "a@b.com"))
                .thenReturn(List.of(pedido("aguardando")));
        assertEquals(1, service.listarDoUsuario(" A@B.com ").size());
        assertThrows(ResponseStatusException.class, () -> service.listarDoUsuario(" "));
    }

    @Test void listarDisponiveisFiltraPorCategoriaQuandoSolicitado() {
        var pageable = PageRequest.of(0, 20);
        when(repository.encontrarDisponiveis("aguardando", pageable)).thenReturn(new PageImpl<>(List.of()));
        when(repository.encontrarDisponiveisPorServico("aguardando", "eletrica", pageable))
                .thenReturn(new PageImpl<>(List.of(pedido("aguardando"))));
        assertTrue(service.listarDisponiveis(null, null, pageable).isEmpty());
        assertEquals(1, service.listarDisponiveis(null, "eletrica", pageable).getContent().size());
    }

    @Test void atualizarNaoPermiteAssumirPedidoPeloEndpointGenerico() {
        Pedido atual = pedido("aguardando"); atual.setProEmail(null); atual.setProId(null);
        Pedido atualizado = pedido("a_caminho");
        when(repository.findById("o_123")).thenReturn(Optional.of(atual));
        assertEquals(403,assertThrows(ResponseStatusException.class,()->service.atualizar("o_123", "pro@taskgo.com", atualizado)).getStatusCode().value());
        verify(repository,never()).save(any());
    }

    @Test void atualizarPersisteConclusaoERejeitaUsuarioOuTransicaoInvalida() {
        when(repository.findById("o_123")).thenReturn(Optional.of(pedido("em_andamento")), Optional.of(pedido("aguardando")));
        when(repository.save(any(Pedido.class))).thenAnswer(inv -> inv.getArgument(0));
        Pedido salvo = service.atualizar("o_123", "pro@taskgo.com", pedido("concluido"));
        assertNotNull(salvo.getCompletedAt());
        assertThrows(ResponseStatusException.class, () -> service.atualizar("o_123", "intruso@taskgo.com", pedido("cancelado")));
        assertThrows(ResponseStatusException.class, () -> service.atualizar("o_123", "pro@taskgo.com", pedido("concluido")));
    }

    @Test void percorreFluxoDeAceiteChegadaInicioEConclusao() {
        Pedido[] atual={pedido("aguardando")};when(repository.findById("o_123")).thenAnswer(inv->Optional.of(atual[0]));
        when(repository.save(any(Pedido.class))).thenAnswer(inv->{atual[0]=inv.getArgument(0);return atual[0];});
        for(String status:List.of("a_caminho","chegou","em_andamento","concluido"))
            assertEquals(status,service.atualizar("o_123","pro@taskgo.com",pedido(status)).getStatus());
        assertNotNull(atual[0].getAcceptedAt(), "aceite deve ser gravado");
        assertNotNull(atual[0].getCompletedAt(), "conclusão deve ser gravada");
    }

    @Test void cancelarPedidoRegistraStatusCancelado() {
        Pedido atual=pedido("aguardando");when(repository.findById("o_123")).thenReturn(Optional.of(atual));
        when(repository.save(any(Pedido.class))).thenAnswer(inv->inv.getArgument(0));
        assertEquals("cancelado",service.atualizar("o_123","cliente@taskgo.com",pedido("cancelado")).getStatus());
    }

    @Test void aceitarAtualizaPedidoExistenteComPrestadorDoBanco() {
        UsuarioRepository usuarios = mock(UsuarioRepository.class);
        PedidoService acceptanceService = new PedidoService(repository, usuarios);
        Usuario pro = new Usuario(); pro.setTipo("profissional"); pro.setEmail("Pro@Taskgo.com");
        pro.setProId("pro_42"); pro.setNome("Profissional Teste");
        Pedido accepted = pedido("a_caminho"); accepted.setProEmail("pro@taskgo.com"); accepted.setProId("pro_42");
        when(usuarios.findByEmailIgnoreCase(anyString())).thenReturn(Optional.of(pro));
        when(repository.aceitarSeDisponivel(eq("o_123"), eq("pro@taskgo.com"), eq("pro_42"), eq("Profissional Teste"), anyLong())).thenReturn(1);
        when(repository.findById("o_123")).thenReturn(Optional.of(accepted));

        Pedido result = acceptanceService.aceitar("o_123", " Pro@Taskgo.com ");

        assertEquals("o_123", result.getId());
        assertEquals("a_caminho", result.getStatus());
        assertEquals("pro_42", result.getProId());
        assertEquals("pro@taskgo.com", result.getProEmail());
        verify(repository, never()).save(any());
    }

    @Test void aceitarRejeitaContaClienteEPedidoJaIndisponivel() {
        UsuarioRepository usuarios = mock(UsuarioRepository.class);
        PedidoService acceptanceService = new PedidoService(repository, usuarios);
        Usuario cliente = new Usuario(); cliente.setTipo("cliente"); cliente.setEmail("cliente@taskgo.com");
        when(usuarios.findByEmailIgnoreCase("cliente@taskgo.com")).thenReturn(Optional.of(cliente));
        assertEquals(403, assertThrows(ResponseStatusException.class,
                () -> acceptanceService.aceitar("o_123", "cliente@taskgo.com")).getStatusCode().value());

        Usuario pro = new Usuario(); pro.setTipo("profissional"); pro.setEmail("pro@taskgo.com"); pro.setProId("pro_42");
        when(usuarios.findByEmailIgnoreCase("pro@taskgo.com")).thenReturn(Optional.of(pro));
        when(repository.aceitarSeDisponivel(eq("o_123"), eq("pro@taskgo.com"), eq("pro_42"), isNull(), anyLong())).thenReturn(0);
        when(repository.existsById("o_123")).thenReturn(true);
        assertEquals(409, assertThrows(ResponseStatusException.class,
                () -> acceptanceService.aceitar("o_123", "pro@taskgo.com")).getStatusCode().value());
    }

    @Test void avaliarExigeClienteDoPedidoConcluidoENotaUnica() {
        Pedido concluido=pedido("concluido"); concluido.setRating(null);
        when(repository.findById("o_123")).thenReturn(Optional.of(concluido));
        when(repository.save(any(Pedido.class))).thenAnswer(inv->inv.getArgument(0));
        assertSame(concluido,service.avaliar("o_123","cliente@taskgo.com",5d,"Ótimo serviço"));
        assertEquals(5d,concluido.getRating()); assertEquals("Ótimo serviço",concluido.getExtra().get("comment"));
        assertEquals(409,assertThrows(ResponseStatusException.class,()->service.avaliar("o_123","cliente@taskgo.com",4d,"Repetida")).getStatusCode().value());
    }

    @Test void avaliarImpedeOutrosUsuariosPedidosNaoConcluidosENotasInvalidas() {
        Pedido pending=pedido("a_caminho");
        when(repository.findById("o_123")).thenReturn(Optional.of(pending));
        assertEquals(403,assertThrows(ResponseStatusException.class,()->service.avaliar("o_123","intruso@taskgo.com",5d,"x")).getStatusCode().value());
        assertEquals(409,assertThrows(ResponseStatusException.class,()->service.avaliar("o_123","cliente@taskgo.com",5d,"x")).getStatusCode().value());
        assertEquals(400,assertThrows(ResponseStatusException.class,()->service.avaliar("o_123","cliente@taskgo.com",6d,"x")).getStatusCode().value());
        verify(repository,never()).save(any());
    }
}
