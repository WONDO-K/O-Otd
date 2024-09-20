package com.threeheads.apigateway.auth.jwt;


import com.threeheads.apigateway.feign.UserFeignClient;
import com.threeheads.apigateway.redis.service.TokenBlacklistService;
import com.threeheads.library.dto.auth.security.SecurityUserDto;
import com.threeheads.library.entity.User;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    private final Logger log = LoggerFactory.getLogger(getClass());
    private final JwtUtil jwtUtil;
    private final TokenBlacklistService tokenBlacklistService;
    private final UserFeignClient userFeignClient;  // UserFeignClient 주입

    public static class Config {
        // 필요한 경우 설정 추가 가능
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String accessToken = resolveToken(exchange);
            log.info("Access Token: " + accessToken);

            // 토큰 검사 생략(모두 허용 URL의 경우 토큰 검사 통과)
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

                // FeignClient를 사용해 user-service에서 이메일로 사용자 정보 조회
                User findUser  = userFeignClient.findByEmail(email);
                if (findUser  == null) {
                    throw new JwtException("유효하지 않은 사용자입니다.");
                }

                SecurityUserDto userDto = SecurityUserDto.builder()
                        .id(findUser.getId())
                        .email(findUser.getEmail())
                        .username(findUser.getUsername())
                        .role(findUser.getRole())
                        .build();

                // UserDetails로 Authentication 객체 생성 및 SecurityContext에 설정
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
    private Authentication getAuthentication(SecurityUserDto user) {
        return new UsernamePasswordAuthenticationToken(user, "",
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
    }

    public static SecurityUserDto getUser() {
        return (SecurityUserDto) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}
