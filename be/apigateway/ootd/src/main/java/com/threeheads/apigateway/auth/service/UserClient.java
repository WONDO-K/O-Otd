package com.threeheads.apigateway.auth.service;

import com.threeheads.library.entity.User;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class UserClient {
    private final WebClient webClient;

    public UserClient(WebClient.Builder webClientBuilder) {
        // API Gateway를 통해 요청을 보냄
        this.webClient = webClientBuilder.baseUrl("http://localhost:8081") // API Gateway 주소
                .build();
    }

    public Mono<User> findByEmail(String email) {
        // user-client를 user-service 경로로 변경
        return webClient.get()
                .uri("/user-client/findByEmail?email={email}", email) // Gateway 라우팅 경로
                .retrieve()
                .bodyToMono(User.class);
    }

    public Mono<Void> registerUser(User user) {
        return webClient.post()
                .uri("/user-client/register")
                .contentType(MediaType.APPLICATION_JSON)  // Content-Type을 JSON으로 설정
                .bodyValue(user)
                .retrieve()
                .bodyToMono(Void.class);
    }
}