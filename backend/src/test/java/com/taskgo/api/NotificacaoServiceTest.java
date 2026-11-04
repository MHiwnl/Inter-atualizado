package com.taskgo.api;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class NotificacaoServiceTest {
    private NotificacaoRepository repository;private NotificacaoService service;
    @BeforeEach void setup(){repository=mock(NotificacaoRepository.class);service=new NotificacaoService(repository);}
    @Test void registraEventoInternoComStatusCriadaENaoDuplica(){
        when(repository.findByUsuarioIdAndChaveEvento(7L,"m:m1")).thenReturn(Optional.empty(),Optional.of(new Notificacao("n1",7L,"p1","m:m1","mensagem","Nova","Texto",10)));
        when(repository.save(any())).thenAnswer(i->{Notificacao n=i.getArgument(0);return n;});
        var created=service.criar(7L,"p1","mensagem","Nova","Texto","m:m1");
        assertEquals("in_app",created.getCanal());assertEquals("criada",created.getStatusEntrega());
        assertEquals("n1",service.criar(7L,"p1","mensagem","Nova","Texto","m:m1").getId());verify(repository,times(1)).save(any());
    }
    @Test void naoLidasESomenteOProprietarioPodeMarcar(){
        Notificacao n=new Notificacao("n1",7L,"p1","m:m1","mensagem","Nova","Texto",10);
        when(repository.findByIdAndUsuarioId("n1",7L)).thenReturn(Optional.of(n));when(repository.save(n)).thenReturn(n);
        when(repository.findByIdAndUsuarioId("n1",8L)).thenReturn(Optional.empty());
        assertEquals("n1",service.marcarLida(7L,"n1").getId());
        assertEquals(404,assertThrows(ResponseStatusException.class,()->service.marcarLida(8L,"n1")).getStatusCode().value());
        verify(repository).save(n);
    }
    @Test void marcarTodasSalvaSomentePendentes(){
        Notificacao n=new Notificacao("n1",7L,null,"evt","pedido","Pedido","Texto",10);
        when(repository.findByUsuarioIdAndLidaEmIsNull(7L)).thenReturn(List.of(n));
        service.marcarTodas(7L);assertNotNull(n.getLidaEm());verify(repository).saveAll(List.of(n));
    }
}
