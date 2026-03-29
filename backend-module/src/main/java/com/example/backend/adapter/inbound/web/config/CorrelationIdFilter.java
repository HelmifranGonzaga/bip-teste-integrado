package com.example.backend.adapter.inbound.web.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Correlation ID Filter.
 * Adiciona correlation ID ao MDC para rastreamento distribuído.
 *
 * Uso em logs:
 * - MDC.get("correlationId") retorna ID da requisição
 * - Logback (.xml) inclui ${correlationId} em JSON logs
 *
 * Headers:
 * - X-Correlation-ID (entrada) ou gera novo UUID
 * - X-Trace-ID (saída) para clientes rastrearem requisições
 */
@Component
public class CorrelationIdFilter extends OncePerRequestFilter {

    private static final String CORRELATION_ID = "correlationId";
    private static final String HEADER_CORRELATION_ID = "X-Correlation-ID";
    private static final String HEADER_TRACE_ID = "X-Trace-ID";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String correlationId = request.getHeader(HEADER_CORRELATION_ID);
        if (correlationId == null || correlationId.isEmpty()) {
            correlationId = UUID.randomUUID().toString();
        }

        MDC.put(CORRELATION_ID, correlationId);
        response.setHeader(HEADER_TRACE_ID, correlationId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.remove(CORRELATION_ID);
        }
    }
}
