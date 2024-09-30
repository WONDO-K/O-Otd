package com.threeheads.apigateway.auth.jwt;

import com.threeheads.apigateway.client.UserClient;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
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
    private final UserClient userClient;

    @Value("${jwt.secret}")
    private String secretKey;

    // JWT 검증이 필요 없는 경로들 (Swagger 및 인증 관련 경로)
    private static final List<String> EXCLUDED_PATHS = List.of(
            "/swagger-ui", "/v3/api-docs", "/swagger-ui/index.html",
            "/user-service/auth", "/user-service/v3/api-docs", "/user-service/swagger-ui",
            "/gallery-service/v3/api-docs", "/gallery-service/swagger-ui"
    );
//    // JWT 검증이 필요 없는 경로들 (Swagger 및 인증 관련 경로)
//    private static final List<String> EXCLUDED_PATHS = List.of(
//        "/swagger-ui/**",              // Swagger UI 페이지 자체
//        "/v3/api-docs",                // 공통 API 문서 경로
//        "/user-service/v3/api-docs/**", // user-service의 Swagger 문서
//        "/user-service/swagger-ui/**",  // user-service의 Swagger UI
//        "/gallery-service/v3/api-docs/**", // gallery-service의 Swagger 문서
//        "/gallery-service/swagger-ui/**",  // gallery-service의 Swagger UI
//        "/user-service/auth/**"         // 로그인, 로그아웃, 토큰 재발급 경로
//    );


    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String requestPath = exchange.getRequest().getPath().toString();

        log.info("Request path: {}", requestPath);

        // JWT 검증이 필요 없는 경로인지 확인
        if (isExcludedPath(requestPath)) {
//            return chain.filter(exchange);  // 검증을 건너뛰고 다음 필터로 이동
            // 헤더는 추가하지만 JWT 검증은 생략
            return addHeadersWithoutJwtValidation(exchange, chain);
        }

        // JWT 토큰 추출
        String accessToken = extractToken(exchange);
        log.info("Authorization Header: {}", accessToken); // 토큰 출력 로그

        // 리프레시 토큰은 특정 경로에서만 필요하므로 조건에 따라 추출
        final String refreshToken = isRefreshTokenRequired(exchange) ? extractRefreshToken(exchange) : null;

        if (accessToken == null || !validateToken(accessToken)) {
            log.warn("유효하지 않거나 누락된 JWT 토큰입니다.");
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // 블랙리스트 검증을 위해 유저 서비스에 요청 전송
        return userClient.isTokenBlacklisted(accessToken)
                .flatMap(isBlacklisted -> {
                    if (isBlacklisted) {
                        log.warn("블랙리스트에 등록된 JWT 토큰입니다: {}", accessToken);
                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    }
                    log.info("블랙리스트에 등록되지 않은 JWT 토큰입니다: {}", accessToken);
                    Claims claims = getClaims(accessToken);
                    if (claims != null) {
                        String userId = claims.getSubject();
                        String role = (String) claims.get("role");

                        // 파싱된 값이 null이 아닌지 확인
                        log.info("파싱된 사용자 정보: ID={}, Role={}", userId, role);

                        // 헤더에 사용자 정보 및 리프레시 토큰 추가 (필요 시)
                        var requestMutator = exchange.getRequest().mutate()
                                .header("X-User-ID", userId)
                                .header("X-User-Role", role)
                                .header("Authorization", "Bearer " + accessToken); // 표준 헤더에 액세스 토큰 추가
                        log.info("사용자 정보 추가: ID={}, Role={}", userId, role);
                        log.info("헤더 정보 : {}", requestMutator.build().getHeaders());

                        if (refreshToken != null) {
                            requestMutator.header("refreshToken", refreshToken); // 리프레시 토큰 추가
                        }

                        // 수정된 요청 객체를 교체
                        exchange.mutate().request(requestMutator.build());

                    }

                    // chain.filter에 수정된 exchange를 넘기면서 다음 필터로 전달
                    return chain.filter(exchange);
                })
                .onErrorResume(e -> {
                    log.error("토큰 검증 중 오류 발생", e);
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                });
    }

    // JWT 검증 없이 헤더 추가만 수행
    private Mono<Void> addHeadersWithoutJwtValidation(ServerWebExchange exchange, WebFilterChain chain) {
        String accessToken = extractToken(exchange);
        final String refreshToken = isRefreshTokenRequired(exchange) ? extractRefreshToken(exchange) : null;

        // 사용자 정보 추가 로직 (필요한 경우 더 처리)
        addHeaders(exchange, accessToken, refreshToken, null, null);

        return chain.filter(exchange);
    }

    // 헤더 추가 로직 분리
    private void addHeaders(ServerWebExchange exchange, String accessToken, String refreshToken, String userId, String role) {
        var requestMutator = exchange.getRequest().mutate();
        if (userId != null) {
            requestMutator.header("X-User-ID", userId);
        }
        if (role != null) {
            requestMutator.header("X-User-Role", role);
        }
        if (accessToken != null) {
            requestMutator.header("Authorization", "Bearer " + accessToken); // 표준 헤더에 액세스 토큰 추가
        }
        if (refreshToken != null) {
            requestMutator.header("refreshToken", refreshToken); // 리프레시 토큰 추가
        }
        // 수정된 요청 객체를 교체
        exchange.mutate().request(requestMutator.build());
    }

    private boolean isExcludedPath(String path) {
        // JWT 검증이 필요 없는 경로인지 검사
        return EXCLUDED_PATHS.stream().anyMatch(path::startsWith);
    }

    private boolean isRefreshTokenRequired(ServerWebExchange exchange) {
        // 토큰 갱신 경로에서만 리프레시 토큰 필요 (예시로 /auth/refresh 경로를 검사)
        return exchange.getRequest().getPath().toString().contains("/auth/refresh");
    }

    private String extractToken(ServerWebExchange exchange) {
        String bearerToken = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private boolean validateToken(String token) {
        try {
            Claims claims = getClaims(token);
            return claims != null && claims.getExpiration().after(new Date());
        } catch (Exception e) {
            log.error("유효하지 않은 JWT 토큰입니다.", e);
            return false;
        }
    }

    private Claims getClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secretKey) // 비밀키 설정
                    .parseClaimsJws(token) // 토큰 파싱
                    .getBody(); // Claims 추출
        } catch (ExpiredJwtException e) {
            log.error("JWT 토큰이 만료되었습니다.", e);
            return null; // 만료된 토큰 처리
        } catch (JwtException e) {
            log.error("JWT 토큰이 유효하지 않습니다.", e);
            return null; // 잘못된 토큰 처리
        }
    }

    private String extractRefreshToken(ServerWebExchange exchange) {
        return exchange.getRequest().getHeaders().getFirst("refreshToken");
    }
}
