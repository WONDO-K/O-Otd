package com.threeheads.apigateway.redis.repository;

import com.threeheads.apigateway.redis.domain.RefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
    Optional<RefreshToken> findByAccessToken(String accessToken);
    Optional<RefreshToken> findByUserEmail(String userEmail);
    void deleteByAccessToken(String accessToken);
}