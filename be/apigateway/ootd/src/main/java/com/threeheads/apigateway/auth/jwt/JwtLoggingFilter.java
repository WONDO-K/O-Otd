package com.threeheads.apigateway.auth.jwt;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
@Component
@RequiredArgsConstructor
public class JwtLoggingFilter implements WebFilter {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // JWT 토큰이 Authorization 헤더에 있는지 확인
        String token = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (token != null) {
            log.info("JWT Token found: {}", token);  // JWT 토큰 로그 출력
        } else {
            log.warn("JWT Token is missing in request to: {}", exchange.getRequest().getURI());
        }

        // 헤더 전체를 출력하여 디버깅 도움
        logHeaders(exchange);

        return chain.filter(exchange);
    }

    // 모든 요청 헤더를 출력하는 디버깅 함수
    private void logHeaders(ServerWebExchange exchange) {
        HttpHeaders headers = exchange.getRequest().getHeaders();
        headers.forEach((headerName, headerValues) -> {
            log.info("Header '{}' : {}", headerName, headerValues);
        });
    }
}