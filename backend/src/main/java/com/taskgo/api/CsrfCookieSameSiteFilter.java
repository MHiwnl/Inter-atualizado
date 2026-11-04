package com.taskgo.api;

import java.io.IOException;
import java.time.Duration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;
import org.springframework.http.ResponseCookie;
import org.springframework.web.filter.OncePerRequestFilter;

/** Preserves SameSite on Spring Security's CSRF cookie across servlet containers. */
public final class CsrfCookieSameSiteFilter extends OncePerRequestFilter {
    private final String sameSite;

    public CsrfCookieSameSiteFilter(String sameSite) {
        this.sameSite = sameSite;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        HttpServletResponseWrapper wrapped = new HttpServletResponseWrapper(response) {
            @Override
            public void addCookie(Cookie cookie) {
                if (!"XSRF-TOKEN".equals(cookie.getName())) {
                    super.addCookie(cookie);
                    return;
                }
                ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(cookie.getName(), cookie.getValue())
                        .path(cookie.getPath() == null ? "/" : cookie.getPath())
                        .secure(cookie.getSecure())
                        .httpOnly(cookie.isHttpOnly())
                        .sameSite(sameSite);
                if (cookie.getDomain() != null) builder.domain(cookie.getDomain());
                if (cookie.getMaxAge() >= 0) builder.maxAge(Duration.ofSeconds(cookie.getMaxAge()));
                super.addHeader("Set-Cookie", builder.build().toString());
            }
        };
        chain.doFilter(request, wrapped);
    }
}
