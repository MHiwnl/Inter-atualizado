package com.taskgo.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.cors.CorsConfiguration;

class CorsConfigurationTest {
    @Test
    void allowsOnlyConfiguredFrontendOriginsWithSessionCredentials() {
        var source = new SecurityConfig().corsConfigurationSource(
                "https://taskgo.example,https://preview.taskgo.example");
        CorsConfiguration configuration = source.getCorsConfiguration(
                new org.springframework.mock.web.MockHttpServletRequest("GET", "/api/auth/sessao"));

        assertEquals("https://taskgo.example", configuration.checkOrigin("https://taskgo.example"));
        assertEquals("https://preview.taskgo.example", configuration.checkOrigin("https://preview.taskgo.example"));
        assertNull(configuration.checkOrigin("https://untrusted.example"));
        assertFalse(configuration.getAllowedOrigins().contains("*"));
        assertTrue(configuration.getAllowCredentials());
        assertTrue(configuration.getAllowedMethods().contains("OPTIONS"));
    }

    @Test
    void productionCsrfCookieIsSecureAndSupportsCrossOriginFrontend() throws Exception {
        var repository = new SecurityConfig().csrfTokenRepository(true);
        var request = new MockHttpServletRequest();
        var response = new MockHttpServletResponse();

        var token = repository.generateToken(request);
        new CsrfCookieSameSiteFilter("None").doFilter(request, response,
                (wrappedRequest, wrappedResponse) -> repository.saveToken(token, (HttpServletRequest) wrappedRequest,
                        (HttpServletResponse) wrappedResponse));

        String cookie = response.getHeader("Set-Cookie");
        assertTrue(cookie.contains("Secure"));
        assertTrue(cookie.toLowerCase().contains("samesite=none"), cookie);
        assertTrue(cookie.contains("Path=/"));
    }
}
