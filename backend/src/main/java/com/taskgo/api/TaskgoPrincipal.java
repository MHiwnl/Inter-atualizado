package com.taskgo.api;

import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public record TaskgoPrincipal(Long id, String email, String nome, String tipo, String proId, long credentialVersion) implements UserDetails {
    public TaskgoPrincipal(Long id,String email,String nome,String tipo,String proId) { this(id,email,nome,tipo,proId,-1); }
    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + tipo.toUpperCase(java.util.Locale.ROOT)));
    }
    @Override public String getPassword() { return ""; }
    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
