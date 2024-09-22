package com.threeheads.apigateway.auth.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.threeheads.library.dto.auth.StatusResponseDto;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtExceptionFilter implements WebFilter {

    private final ObjectMapper objectMapper;
    private final Logger log = LoggerFactory.getLogger(getClass());

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        return chain.filter(exchange).onErrorResume(e -> {
            if (e instanceof JwtException) {

                log.error("JWT 예외 발생: {}", e.getMessage());

                // JWT 예외가 발생했을 때 401 응답 반환
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

                // 오류 응답을 JSON 형식으로 생성
                StatusResponseDto errorResponse = StatusResponseDto.addStatus(HttpStatus.UNAUTHORIZED.value(), "JWT 토큰이 유효하지 않습니다.");

                // 응답 body에 JSON 데이터를 작성
                try {
                    byte[] bytes = objectMapper.writeValueAsBytes(errorResponse);
                    DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);
                    return exchange.getResponse().writeWith(Mono.just(buffer));
                } catch (IOException ex) {
                    return Mono.error(ex);
                }
            }
            return Mono.error(e); // 다른 예외는 다시 던짐
        });
    }


}
