package com.taskgo.api;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

class PedidoControllerTest {
    private PedidoRepository repository;
    private PedidoController controller;
    @BeforeEach void setup(){repository=mock(PedidoRepository.class);controller=new PedidoController(repository);}

    @Test void listarRetornaEstimativasSalvas(){
        PedidoEstimativa p=new PedidoEstimativa();p.setServico("eletrica");p.setEmailCliente("a@b.com");when(repository.findByEmailClienteIgnoreCase(eq("a@b.com"),any(Pageable.class))).thenReturn(new PageImpl<>(List.of(p)));
        var principal=new TaskgoPrincipal(4L,"a@b.com","Ana","cliente",null);
        var auth=UsernamePasswordAuthenticationToken.authenticated(principal,null,principal.getAuthorities());
        assertEquals("eletrica",controller.listar(auth,0,20,null,"id,desc").getBody().content().get(0).servico());
    }
    @Test void estimarSalvaPedidoRecebido(){
        PedidoEstimativa p=new PedidoEstimativa();p.setServico("hidraulica");p.setEmailCliente("outro@taskgo.com");when(repository.save(p)).thenReturn(p);
        assertSame(p,controller.estimar(p,null));assertNull(p.getEmailCliente());verify(repository).save(p);
    }
}
