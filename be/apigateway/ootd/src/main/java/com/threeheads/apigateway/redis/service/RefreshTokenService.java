package com.threeheads.apigateway.redis.service;

import org.springframework.transaction.annotation.Transactional;

public interface RefreshTokenService {

    @Transactional
    void saveTokenInfo(String email, String refreshToken, String accessToken);

}