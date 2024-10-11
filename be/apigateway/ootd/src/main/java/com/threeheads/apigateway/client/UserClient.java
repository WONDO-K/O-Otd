package com.threeheads.apigateway.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.loadbalancer.reactive.ReactorLoadBalancerExchangeFilterFunction;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Component

public class UserClient {

    private final WebClient webClient;
    private final Logger log = LoggerFactory.getLogger(getClass());

//    public UserClient(WebClient.Builder webClientBuilder) {
//        this.webClient = webClientBuilder.baseUrl("lb://USER-SERVICE") // 유저 서비스의 실제 URL과 포트
//                .build();
//    }

    public UserClient(WebClient.Builder webClientBuilder, ReactorLoadBalancerExchangeFilterFunction lbFunction) {
        this.webClient = webClientBuilder
                .baseUrl("lb://USER-SERVICE")
                .filter(lbFunction)
                .build();
    }

//    public Mono<Boolean> isTokenBlacklisted(String token) {
//        return webClient.get()
//                .uri("/auth/is-blacklisted?token={token}", token)  // 유저 서비스의 경로에 맞게 수정
//                .retrieve()
//                .bodyToMono(Boolean.class)
//                .doOnError(e -> log.error("블랙리스트 토큰 확인 중 오류 발생: {}", e.getMessage()))
//                .onErrorReturn(WebClientResponseException.class, false); // 오류 발생 시 기본값 반환
//    }
public Mono<Boolean> isTokenBlacklisted(String token) {
    return webClient.get()
            .uri(uriBuilder -> uriBuilder
                    .path("/auth/is-blacklisted")
                    .queryParam("accessToken", token)  // 쿼리 파라미터로 토큰 전달
                    .build())
            .retrieve()
            .bodyToMono(Boolean.class)
            .doOnError(e -> log.error("블랙리스트 토큰 확인 중 오류 발생: {}", e.getMessage()))
            .onErrorReturn(WebClientResponseException.class, false); // 오류 발생 시 기본값 반환
}
}