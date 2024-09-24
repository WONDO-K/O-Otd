package com.threeheads.apigateway.common;

import com.threeheads.apigateway.auth.jwt.JwtAuthFilter;
import com.threeheads.apigateway.auth.jwt.JwtExceptionFilter;
import com.threeheads.apigateway.util.CustomReactiveUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final JwtExceptionFilter jwtExceptionFilter;
    private final CustomReactiveUserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)  // CSRF 비활성화
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)  // 기본 인증 비활성화
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)  // 폼 로그인 비활성화
                .authorizeExchange(exchange -> exchange
                        .pathMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()  // Swagger UI 접근 허용
                        .pathMatchers("/api/auth/token/refresh").permitAll()
                        .pathMatchers("/api/auth/**").permitAll()
                        .pathMatchers("/api/session/**").permitAll()
                        .anyExchange().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, SecurityWebFiltersOrder.AUTHORIZATION)  // JWT 필터 추가
                .addFilterBefore(jwtExceptionFilter, SecurityWebFiltersOrder.AUTHORIZATION);  // 예외 필터 추가

        return http.build();
    }
    @Bean
    public ReactiveAuthenticationManager reactiveAuthenticationManager() {
        return new ReactiveAuthenticationManager() {
            @Override
            public Mono<Authentication> authenticate(Authentication authentication) {
                return userDetailsService.findByUsername(authentication.getName())
                        .map(userDetails -> new UsernamePasswordAuthenticationToken(userDetails, authentication.getCredentials(), userDetails.getAuthorities()));
            }
        };
    }
}