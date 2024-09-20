package com.threeheads.apigateway.redis.repository;

import com.threeheads.apigateway.redis.domain.RefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {

    // accessToken으로 RefreshToken을 찾아온다.
    Optional<RefreshToken> findByAccessToken(String accessToken);

    // 사용자 이메일로 RefreshToken을 찾아온다.
    Optional<RefreshToken> findByUserEmail(String userEmail);

    // RefreshToken을 삭제한다.
    void deleteByAccessToken(String accessToken);
}