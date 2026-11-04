package com.taskgo.api;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class LocalizacaoPedidoServiceTest {
    private static final long NOW=1_800_000_000_000L;
    private PedidoContratadoRepository pedidos;
    private LocalizacaoPedidoRepository locais;
    private LocalizacaoPedidoService service;
    private Pedido order;
    private final TaskgoPrincipal pro=new TaskgoPrincipal(2L,"pro@taskgo.com","Pro","profissional","pro-2");
    private final TaskgoPrincipal cliente=new TaskgoPrincipal(1L,"cliente@taskgo.com","Cliente","cliente",null);

    @BeforeEach void setup(){
        pedidos=mock(PedidoContratadoRepository.class); locais=mock(LocalizacaoPedidoRepository.class);
        service=new LocalizacaoPedidoService(pedidos,locais,Clock.fixed(Instant.ofEpochMilli(NOW), ZoneOffset.UTC));
        order=new Pedido();order.setId("pedido-1");order.setProEmail("pro@taskgo.com");order.setClientEmail("cliente@taskgo.com");order.setStatus("a_caminho");
        when(pedidos.findById("pedido-1")).thenReturn(Optional.of(order));
    }
    @Test void profissionalDoPedidoPersisteSomenteUltimaPosicao(){
        var request=new LocalizacaoPedidoService.LocalizacaoRequest(-23.5,-46.6,12.5,NOW);
        when(locais.findById("pedido-1")).thenReturn(Optional.empty());
        when(locais.save(any())).thenAnswer(inv->inv.getArgument(0));
        var result=service.registrar("pedido-1",pro,request);
        assertEquals(-23.5,result.latitude());assertEquals(-46.6,result.longitude());assertEquals(12.5,result.accuracy());assertEquals(NOW,result.receivedAt());
        verify(locais).save(any(LocalizacaoPedido.class));
    }
    @Test void participantePodeLerMasTerceiroNao(){
        when(locais.findById("pedido-1")).thenReturn(Optional.of(new LocalizacaoPedido("pedido-1",1,2,3,NOW,NOW)));
        assertTrue(service.obter("pedido-1",cliente).isPresent());
        var stranger=new TaskgoPrincipal(3L,"outro@taskgo.com","Outro","cliente",null);
        assertEquals(403,assertThrows(ResponseStatusException.class,()->service.obter("pedido-1",stranger)).getStatusCode().value());
    }
    @Test void rejeitaLocalizacaoInvalidaOuPedidoForaDaEtapaDeRastreamento(){
        assertEquals(400,assertThrows(ResponseStatusException.class,()->service.registrar("pedido-1",pro,new LocalizacaoPedidoService.LocalizacaoRequest(91,2,3,NOW))).getStatusCode().value());
        order.setStatus("chegou");
        assertEquals(409,assertThrows(ResponseStatusException.class,()->service.registrar("pedido-1",pro,new LocalizacaoPedidoService.LocalizacaoRequest(1,2,3,NOW))).getStatusCode().value());
        verify(locais,never()).save(any());
    }
    @Test void outroProfissionalNaoPodeEnviarLocalizacao(){
        var outro=new TaskgoPrincipal(4L,"intruso@taskgo.com","Outro","profissional","pro-4");
        assertEquals(403,assertThrows(ResponseStatusException.class,()->service.registrar("pedido-1",outro,new LocalizacaoPedidoService.LocalizacaoRequest(1,2,3,NOW))).getStatusCode().value());
    }
    @Test void encerraApagandoLocalizacaoDepoisDoStatus(){
        order.setStatus("concluido");service.limparSeEncerrado(order);verify(locais).deleteById("pedido-1");
    }
}
