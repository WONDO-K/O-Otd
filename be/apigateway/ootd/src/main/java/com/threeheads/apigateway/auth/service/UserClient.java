package com.threeheads.apigateway.auth.service;

import com.threeheads.library.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class UserClient {
    private final WebClient webClient;

    public UserClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:8081").build();
    }

    public Mono<User> findByEmail(String email) {
        return webClient.get()
                .uri("/user/findByEmail?email={email}", email)
                .retrieve()
                .bodyToMono(User.class);
    }

    public Mono<Void> registerUser(User user) {
        return webClient.post()
                .uri("/user/register")
                .bodyValue(user)
                .retrieve()
                .bodyToMono(Void.class);
    }
}