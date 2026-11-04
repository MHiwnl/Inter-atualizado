package com.taskgo.api;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

class SessionVersionFilterTest {
    UsuarioRepository usuarios=mock(UsuarioRepository.class);
    SessionVersionFilter filter=new SessionVersionFilter(usuarios);
    @AfterEach void clear(){SecurityContextHolder.clearContext();}

    @Test void senhaRedefinidaInvalidaSessaoComVersaoAntiga()throws Exception{
        Usuario atual=new Usuario();atual.setId(5L);atual.setCredentialVersion(2);
        when(usuarios.findById(5L)).thenReturn(Optional.of(atual));
        var principal=new TaskgoPrincipal(5L,"a@b.com","Ana","cliente",null,1);
        SecurityContext ctx=SecurityContextHolder.createEmptyContext();ctx.setAuthentication(UsernamePasswordAuthenticationToken.authenticated(principal,null,principal.getAuthorities()));SecurityContextHolder.setContext(ctx);
        MockHttpServletRequest request=new MockHttpServletRequest();MockHttpSession session=new MockHttpSession();session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,ctx);request.setSession(session);
        MockHttpServletResponse response=new MockHttpServletResponse();FilterChain chain=mock(FilterChain.class);
        filter.doFilter(request,response,chain);
        assertEquals(401,response.getStatus());verify(chain,never()).doFilter(any(),any());assertNull(request.getSession(false));
    }

    @Test void versaoAtualMantemSessaoValida()throws Exception{
        Usuario atual=new Usuario();atual.setId(5L);atual.setCredentialVersion(2);when(usuarios.findById(5L)).thenReturn(Optional.of(atual));
        var principal=new TaskgoPrincipal(5L,"a@b.com","Ana","cliente",null,2);SecurityContext ctx=SecurityContextHolder.createEmptyContext();ctx.setAuthentication(UsernamePasswordAuthenticationToken.authenticated(principal,null,principal.getAuthorities()));SecurityContextHolder.setContext(ctx);
        MockHttpServletRequest request=new MockHttpServletRequest();MockHttpSession session=new MockHttpSession();session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,ctx);request.setSession(session);
        MockHttpServletResponse response=new MockHttpServletResponse();FilterChain chain=mock(FilterChain.class);filter.doFilter(request,response,chain);
        verify(chain).doFilter(request,response);assertEquals(200,response.getStatus());
    }
}
