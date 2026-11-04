package com.taskgo.api;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class ContatoServiceTest {
    private ContatoRepository repository;private ContatoService service;
    @BeforeEach void setup(){repository=mock(ContatoRepository.class);service=new ContatoService(repository,Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"),ZoneOffset.UTC));when(repository.save(any())).thenAnswer(i->i.getArgument(0));}
    @Test void contatoValidoEGravadoSemAfirmarEnvioDeEmail(){
        var result=service.receber(new ContatoService.ContatoRequest(" Ana "," ANA@example.com ","Suporte"," Preciso de ajuda ",""),"127.0.0.1");
        assertEquals("registrada",result.status());assertEquals("nao_configurado",result.emailStatus());verify(repository).save(any(Contato.class));
    }
    @Test void validaCamposEHoneypotAntesDePersistir(){
        assertEquals(400,assertThrows(ResponseStatusException.class,()->service.receber(new ContatoService.ContatoRequest("Ana","ruim","Outro","texto",""),"ip")).getStatusCode().value());
        assertEquals(400,assertThrows(ResponseStatusException.class,()->service.receber(new ContatoService.ContatoRequest("Ana","a@b.com","Outro","texto","preenchido"),"ip")).getStatusCode().value());
        verify(repository,never()).save(any());
    }
    @Test void limitaCincoContatosPorIpNoPeriodo(){
        var req=new ContatoService.ContatoRequest("Ana","a@b.com","Outro","texto","");
        for(int i=0;i<5;i++)service.receber(req,"127.0.0.1");
        assertEquals(429,assertThrows(ResponseStatusException.class,()->service.receber(req,"127.0.0.1")).getStatusCode().value());
        verify(repository,times(5)).save(any(Contato.class));
    }
}
