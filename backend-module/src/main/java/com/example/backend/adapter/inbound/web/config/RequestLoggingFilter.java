package com.example.backend.adapter.inbound.web.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

// Roda logo após o CorrelationIdFilter e antes do Spring Security (order = -100)
// para registrar a duração total da request (incluindo a fase de autenticação).
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);
    private static final long SLOW_REQUEST_THRESHOLD_MS = 500;
    private static final String REQUEST_LOG_PATTERN = "{} {} -> {} ({} ms)";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        long startedAt = System.currentTimeMillis();

        try {
            filterChain.doFilter(request, response);
        } finally {
            long elapsedMs = System.currentTimeMillis() - startedAt;
            String method = request.getMethod();
            String uri = request.getRequestURI();
            int status = response.getStatus();

            if ("OPTIONS".equalsIgnoreCase(method)) {
                log.trace(REQUEST_LOG_PATTERN, method, uri, status, elapsedMs);
            } else if (elapsedMs >= SLOW_REQUEST_THRESHOLD_MS) {
                log.warn(REQUEST_LOG_PATTERN, method, uri, status, elapsedMs);
            } else {
                log.info(REQUEST_LOG_PATTERN, method, uri, status, elapsedMs);
            }
        }
    }
}
