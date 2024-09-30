package com.threeheads.user.redis.repository;


import com.threeheads.user.redis.domain.RefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
    Optional<RefreshToken> findByAccessToken(String accessToken);
    void deleteByAccessToken(String accessToken);
    Optional<RefreshToken> findByRefreshToken(String refreshToken);
}