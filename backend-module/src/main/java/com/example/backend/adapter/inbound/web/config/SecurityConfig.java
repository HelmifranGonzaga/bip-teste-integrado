package com.example.backend.adapter.inbound.web.config;

import com.example.backend.adapter.inbound.web.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.http.HttpMethod;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import java.util.Arrays;
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final String allowedOrigins;
    private final boolean exposeDevEndpoints;
    private final String csrfSameSite;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            @Value("${app.security.cors.allowed-origins:http://localhost:4200}") String allowedOrigins,
            @Value("${app.security.expose-dev-endpoints:false}") boolean exposeDevEndpoints,
            @Value("${app.security.csrf.same-site:Lax}") String csrfSameSite) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.allowedOrigins = allowedOrigins;
        this.exposeDevEndpoints = exposeDevEndpoints;
        this.csrfSameSite = csrfSameSite;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // CSRF via cookie. Como frontend (:4200) e backend (:8082) estão em origens
        // diferentes, o SameSite do cookie impede o Angular de ler o token CSRF.
        // A API já usa JWT Bearer (imune a CSRF), então desabilitamos CSRF para /api/**.
        http.csrf(csrf -> {
                    CookieCsrfTokenRepository csrfRepo = CookieCsrfTokenRepository.withHttpOnlyFalse();
                    csrfRepo.setCookieCustomizer(cookie -> cookie.sameSite(csrfSameSite));
                    csrf.csrfTokenRepository(csrfRepo);
                    csrf.ignoringRequestMatchers("/api/**");
                    if (exposeDevEndpoints) {
                        csrf.ignoringRequestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/h2-console/**");
                    }
                })
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        authz ->
                                {
                                    authz.requestMatchers("/error").permitAll();
                                    authz.requestMatchers("/api/v1/auth/**").permitAll();
                                    if (exposeDevEndpoints) {
                                        authz.requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/h2-console/**")
                                                .permitAll();
                                    }
                                    authz.requestMatchers(HttpMethod.POST, "/api/v1/beneficios").hasRole("ADMIN");
                                    authz.requestMatchers(HttpMethod.PUT, "/api/v1/beneficios/**").hasRole("ADMIN");
                                    authz.requestMatchers(HttpMethod.DELETE, "/api/v1/beneficios/**").hasRole("ADMIN");
                                    authz.requestMatchers(HttpMethod.POST, "/api/v1/usuarios").hasRole("ADMIN");
                                    authz.requestMatchers(HttpMethod.PUT, "/api/v1/usuarios/**").hasRole("ADMIN");
                                    authz.requestMatchers(HttpMethod.DELETE, "/api/v1/usuarios/**").hasRole("ADMIN");
                                    authz.requestMatchers(HttpMethod.PATCH, "/api/v1/usuarios/*/ativo").hasRole("ADMIN");
                                    authz.requestMatchers(HttpMethod.POST, "/api/v1/usuarios/*/reset-password").hasRole("ADMIN");
                                    authz.anyRequest().authenticated();
                                })
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        if (exposeDevEndpoints) {
            http.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));
        }

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permitir múltiplas origens separadas por vírgula em environment
        Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .forEach(configuration::addAllowedOrigin);
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
