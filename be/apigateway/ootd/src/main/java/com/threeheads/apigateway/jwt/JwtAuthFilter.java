package com.threeheads.apigateway.jwt;


import com.threeheads.apigateway.redis.service.TokenBlacklistService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    private final Logger log = LoggerFactory.getLogger(getClass());
    private final JwtUtil jwtUtil;
    private final TokenBlacklistService tokenBlacklistService;
    private final RestTemplate restTemplate;  // RestTemplate 주입

    public static class Config {
        // 필요한 경우 설정 추가 가능
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String accessToken = resolveToken(exchange);
            log.info("Access Token: " + accessToken);

            if (!StringUtils.hasText(accessToken)) {
                log.info("Access Token이 없습니다.");
                return chain.filter(exchange);
            }

            if (tokenBlacklistService.isTokenBlacklisted(accessToken)) {
                log.warn("블랙리스트에 있는 Access Token입니다: {}", accessToken);
                return unauthorizedResponse(exchange);
            }

            if (!jwtUtil.verifyToken(accessToken)) {
                log.info("Access Token이 만료되었습니다.");
                return unauthorizedResponse(exchange);
            }

            try {
                String email = jwtUtil.getUid(accessToken);

                // RestTemplate을 이용해 user-service에서 이메일로 사용자 정보 조회
                ResponseEntity<UserDto> response = restTemplate.getForEntity(
                        "http://user-service/user/findByEmail?email=" + email,
                        UserDto.class
                );

                UserDto userDto = response.getBody();
                if (userDto == null) {
                    throw new JwtException("유효하지 않은 사용자입니다.");
                }

                // SecurityContext에 사용자 정보 설정
                Authentication auth = new UsernamePasswordAuthenticationToken(userDto, null, userDto.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);

                log.info("SecurityContext에 인증 객체 등록 완료");
            } catch (Exception e) {
                return unauthorizedResponse(exchange);
            }

            return chain.filter(exchange);
        };
    }

    private String resolveToken(ServerWebExchange exchange) {
        String bearerToken = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}
