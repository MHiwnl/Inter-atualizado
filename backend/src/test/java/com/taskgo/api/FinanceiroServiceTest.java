package com.taskgo.api;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class FinanceiroServiceTest {
    CarteiraRepository carteiras=mock(CarteiraRepository.class);
    TransacaoFinanceiraRepository transacoes=mock(TransacaoFinanceiraRepository.class);
    SolicitacaoSaqueRepository saques=mock(SolicitacaoSaqueRepository.class);
    FinanceiroService service=new FinanceiroService(carteiras,transacoes,saques);

    @BeforeEach void setup(){
        when(carteiras.findByUsuarioId(any())).thenReturn(Optional.empty());
        when(carteiras.save(any())).thenAnswer(inv->inv.getArgument(0));
        when(carteiras.findByUsuarioIdForUpdate(any())).thenReturn(Optional.empty());
        when(saques.findByUsuarioIdAndChaveIdempotencia(any(),any())).thenReturn(Optional.empty());
        when(saques.save(any())).thenAnswer(inv->inv.getArgument(0));
        when(transacoes.save(any())).thenAnswer(inv->inv.getArgument(0));
        when(transacoes.findByUsuarioIdOrderByCriadaEmDesc(any(),any())).thenReturn(new PageImpl<>(java.util.List.of()));
    }

    @Test void carteiraNovaComecaComSaldoZeroPersistido(){
        var result=service.consultarCarteira(7L);
        assertEquals(new BigDecimal("0.00"),result.disponivel());
        assertEquals(new BigDecimal("0.00"),result.pendente());
        assertEquals(new BigDecimal("0.00"),result.bloqueado());
        verify(carteiras).save(argThat(c->c.getUsuarioId().equals(7L)));
    }

    @Test void extratoEConsultadoPelaIdentidadeDaSessao(){
        service.listarTransacoes(42L,PageRequest.of(0,20));
        verify(transacoes).findByUsuarioIdOrderByCriadaEmDesc(42L,PageRequest.of(0,20));
    }

    @Test void saqueSemSaldoERejeitadoSemRegistrarOperacao(){
        ResponseStatusException error=assertThrows(ResponseStatusException.class,
                ()->service.solicitarSaque(4L,"profissional","pedido-1",new BigDecimal("10.00")));
        assertEquals(HttpStatus.CONFLICT,error.getStatusCode());
        verify(saques,never()).save(any());
        verify(transacoes,never()).save(any());
    }

    @Test void clienteNaoPodeSolicitarSaque(){
        ResponseStatusException error=assertThrows(ResponseStatusException.class,
                ()->service.solicitarSaque(4L,"cliente","pedido-1",new BigDecimal("10.00")));
        assertEquals(HttpStatus.FORBIDDEN,error.getStatusCode());
        verify(carteiras,never()).findByUsuarioIdForUpdate(any());
    }

    @Test void valorComMaisDeDuasCasasERejeitado(){
        ResponseStatusException error=assertThrows(ResponseStatusException.class,
                ()->service.solicitarSaque(4L,"profissional","pedido-1",new BigDecimal("10.001")));
        assertEquals(HttpStatus.BAD_REQUEST,error.getStatusCode());
    }

    @Test void repeticaoIdempotenteRetornaSaqueExistenteSemReservarDeNovo(){
        SolicitacaoSaque anterior=new SolicitacaoSaque("saque-ja-criado",4L,new BigDecimal("10.00"),"repetido",123L);
        when(saques.findByUsuarioIdAndChaveIdempotencia(4L,"repetido")).thenReturn(Optional.of(anterior));
        var response=service.solicitarSaque(4L,"profissional","repetido",new BigDecimal("10.00"));
        assertEquals("saque-ja-criado",response.id());
        verify(carteiras,never()).findByUsuarioIdForUpdate(any());
        verify(saques,never()).save(any());
        verify(transacoes,never()).save(any());
    }

    @Test void chaveIdempotenteNaoPodeSerReutilizadaComOutroValor(){
        SolicitacaoSaque anterior=new SolicitacaoSaque("saque-ja-criado",4L,new BigDecimal("10.00"),"repetido",123L);
        when(saques.findByUsuarioIdAndChaveIdempotencia(4L,"repetido")).thenReturn(Optional.of(anterior));
        ResponseStatusException error=assertThrows(ResponseStatusException.class,
                ()->service.solicitarSaque(4L,"profissional","repetido",new BigDecimal("20.00")));
        assertEquals(HttpStatus.CONFLICT,error.getStatusCode());
        verify(carteiras,never()).findByUsuarioIdForUpdate(any());
    }
}
