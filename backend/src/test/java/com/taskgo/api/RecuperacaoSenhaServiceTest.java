package com.taskgo.api;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

class RecuperacaoSenhaServiceTest {
    UsuarioRepository usuarios=mock(UsuarioRepository.class);
    TokenRecuperacaoSenhaRepository tokens=mock(TokenRecuperacaoSenhaRepository.class);
    EmailRecuperacaoSenha email=mock(EmailRecuperacaoSenha.class);
    RecuperacaoRateLimiter limiter=mock(RecuperacaoRateLimiter.class);
    BCryptPasswordEncoder encoder=new BCryptPasswordEncoder();
    Clock clock=Clock.fixed(Instant.parse("2026-10-28T12:00:00Z"),ZoneOffset.UTC);
    RecuperacaoSenhaService service=new RecuperacaoSenhaService(usuarios,tokens,email,limiter,encoder,clock);

    @BeforeEach void defaults(){when(limiter.permitir(anyString())).thenReturn(true);when(email.configurado()).thenReturn(true);when(tokens.save(any())).thenAnswer(i->i.getArgument(0));}

    @Test void emailInexistenteRecebeMesmoTratamentoSemGerarToken(){
        when(usuarios.findByEmailIgnoreCase("ausente@example.com")).thenReturn(Optional.empty());
        assertDoesNotThrow(()->service.solicitar("ausente@example.com","127.0.0.1"));
        verify(tokens,never()).save(any());verify(email).configurado();verify(email,never()).enviarLink(anyString(),anyString());
    }

    @Test void semCanalConfiguradoNaoCriaTokenNemConsultaConta(){
        when(email.configurado()).thenReturn(false);
        assertDoesNotThrow(()->service.solicitar("ana@example.com","127.0.0.1"));
        verify(email).configurado();verifyNoInteractions(usuarios,tokens);
    }

    @Test void recuperacaoArmazenaHashEEnviaTokenSomenteAoEmailCadastrado(){
        Usuario usuario=new Usuario();usuario.setId(8L);usuario.setEmail("ana@example.com");usuario.setSenha(encoder.encode("senhaantiga"));
        when(usuarios.findByEmailIgnoreCase("ana@example.com")).thenReturn(Optional.of(usuario));
        service.solicitar(" ANA@example.com ","127.0.0.1");
        var captor=org.mockito.ArgumentCaptor.forClass(TokenRecuperacaoSenha.class);verify(tokens).save(captor.capture());
        var token=captor.getValue();assertEquals(8L,token.getUsuarioId());assertEquals(64,token.getTokenHash().length());
        var raw=org.mockito.ArgumentCaptor.forClass(String.class);verify(email).enviarLink(eq("ana@example.com"),raw.capture());
        assertNotEquals(raw.getValue(),token.getTokenHash());assertTrue(token.getExpiraEm().isAfter(clock.instant()));
    }

    @Test void emailComFalhaNaoDeixaTokenUtilizavel(){
        Usuario usuario=new Usuario();usuario.setId(8L);usuario.setEmail("ana@example.com");usuario.setSenha(encoder.encode("senhaantiga"));
        when(usuarios.findByEmailIgnoreCase("ana@example.com")).thenReturn(Optional.of(usuario));doThrow(new IllegalStateException()).when(email).enviarLink(eq("ana@example.com"),anyString());
        assertDoesNotThrow(()->service.solicitar("ana@example.com","127.0.0.1"));verify(tokens,times(2)).deleteByUsuarioId(8L);
    }

    @Test void redefinicaoTrocaHashIncrementaVersaoEConsomeToken(){
        Usuario usuario=new Usuario();usuario.setId(8L);usuario.setEmail("ana@example.com");usuario.setSenha(encoder.encode("senhaantiga"));
        TokenRecuperacaoSenha token=new TokenRecuperacaoSenha("t1",8L,"hash",clock.instant(),clock.instant().plusSeconds(1800));
        when(tokens.findByHashForUpdate(anyString())).thenReturn(Optional.of(token));when(usuarios.findById(8L)).thenReturn(Optional.of(usuario));
        service.redefinir("a".repeat(43),"senha_nova_123","senha_nova_123");
        assertTrue(encoder.matches("senha_nova_123",usuario.getSenha()));assertFalse(encoder.matches("senhaantiga",usuario.getSenha()));assertEquals(1,usuario.getCredentialVersion());
        assertNotNull(token.getUsadoEm());verify(tokens).deleteByUsuarioId(8L);
    }

    @Test void tokenExpiradoOuSenhaDivergenteSaoRecusados(){
        TokenRecuperacaoSenha expirado=new TokenRecuperacaoSenha("t1",8L,"hash",clock.instant().minusSeconds(1900),clock.instant().minusSeconds(1));
        when(tokens.findByHashForUpdate(anyString())).thenReturn(Optional.of(expirado));
        assertThrows(ResponseStatusException.class,()->service.redefinir("a".repeat(43),"senha_nova_123","senha_nova_123"));
        assertThrows(ResponseStatusException.class,()->service.redefinir("a".repeat(43),"senha_nova_123","outra_senha_123"));
    }
}
