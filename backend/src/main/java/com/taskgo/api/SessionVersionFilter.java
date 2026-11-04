package com.taskgo.api;

import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.filter.OncePerRequestFilter;

public class SessionVersionFilter extends OncePerRequestFilter {
    private final UsuarioRepository usuarios;
    public SessionVersionFilter(UsuarioRepository usuarios){this.usuarios=usuarios;}
    @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain)throws ServletException,IOException{
        Authentication auth=SecurityContextHolder.getContext().getAuthentication();
        HttpSession session=request.getSession(false);
        boolean backedBySession=session!=null&&session.getAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY)!=null;
        if(backedBySession&&auth!=null&&auth.getPrincipal() instanceof TaskgoPrincipal p&&p.credentialVersion()>=0){
            boolean valida=usuarios.findById(p.id()).map(u->u.getCredentialVersion()==p.credentialVersion()).orElse(false);
            if(!valida){SecurityContextHolder.clearContext();if(session!=null)session.invalidate();response.sendError(HttpServletResponse.SC_UNAUTHORIZED,"Sessão encerrada. Entre novamente.");return;}
        }
        chain.doFilter(request,response);
    }
}
