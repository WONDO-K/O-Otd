package com.threeheads.apigateway.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.threeheads.apigateway.dto.StatusResponseDto;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtExceptionFilter implements GatewayFilter {

    private final ObjectMapper objectMapper;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange).onErrorResume(JwtException.class, e -> {
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
        });
    }
}
