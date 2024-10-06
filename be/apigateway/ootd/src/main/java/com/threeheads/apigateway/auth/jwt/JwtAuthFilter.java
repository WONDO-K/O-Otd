package com.threeheads.apigateway.auth.jwt;

import com.threeheads.apigateway.client.UserClient;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Date;
import java.util.List;
@Component
@RequiredArgsConstructor
public class JwtAuthFilter implements WebFilter {

    private final Logger log = LoggerFactory.getLogger(getClass());
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Value("${jwt.secret}")
    private String secretKey;

    // JWT 검증이 필요 없는 경로들 (Swagger 및 인증 관련 경로)
    private static final List<String> EXCLUDED_PATHS = List.of(
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/user-service/auth/**",
            "/swagger-ui/index.html",
            "/user-service/v3/api-docs",
            "/user-service/swagger-ui",
            "/gallery-service/v3/api-docs",
            "/gallery-service/swagger-ui"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String requestPath = exchange.getRequest().getPath().toString();
        log.info("Request path: {}", requestPath);

        // JWT 검증이 필요 없는 경로인지 확인
        if (isExcludedPath(requestPath)) {
            log.info("JWT 검증이 필요 없는 경로입니다.");
            return chain.filter(exchange);
        }

        log.info("JWT 검증이 필요한 경로입니다.");

        // JWT 토큰 및 리프레시 토큰 추출
        String accessToken = extractToken(exchange);
        String refreshToken = extractRefreshToken(exchange);

        // 헤더에서 사용자 정보 추출
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");
        String role = exchange.getRequest().getHeaders().getFirst("X-User-Role");

        // 사용자 정보와 토큰이 포함된 요청으로 변경
        if (accessToken != null) {
            log.info("JWT 토큰과 사용자 정보를 헤더에 추가합니다.");

            var requestMutator = exchange.getRequest().mutate()
                    .header("Authorization", "Bearer " + accessToken); // JWT 토큰 그대로 전달

            if (userId != null) {
                requestMutator.header("X-User-ID", userId); // 사용자 ID 추가
            }
            if (role != null) {
                requestMutator.header("X-User-Role", role); // 사용자 역할 추가
            }
            if (refreshToken != null) {
                requestMutator.header("refreshToken", refreshToken); // 리프레시 토큰 추가
            }

            exchange.mutate().request(requestMutator.build());
        }

        return chain.filter(exchange); // 다음 필터로 전달
    }

    // JWT 토큰을 Authorization 헤더에서 추출
    private String extractToken(ServerWebExchange exchange) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        log.info("받아온 Authorization Header: {}", token);

        if (token != null) {
            // 만약 토큰이 "Bearer "로 시작하지 않으면, 자동으로 "Bearer "를 추가해줍니다.
            if (!token.startsWith("Bearer ")) {
                log.info("Bearer 접두사가 없는 토큰입니다. 자동으로 Bearer를 추가합니다.");
                return "Bearer " + token;
            }
            return token;
        }
        return null;
    }

    // 리프레시 토큰을 헤더에서 추출
    private String extractRefreshToken(ServerWebExchange exchange) {
        return exchange.getRequest().getHeaders().getFirst("refreshToken");
    }

    // JWT 검증이 필요 없는 경로인지 확인
    private boolean isExcludedPath(String path) {
        return EXCLUDED_PATHS.stream().anyMatch(excludedPath -> pathMatcher.match(excludedPath, path));
    }
}
