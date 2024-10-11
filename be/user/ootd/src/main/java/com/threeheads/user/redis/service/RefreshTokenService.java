package com.threeheads.user.redis.service;

import org.springframework.transaction.annotation.Transactional;

public interface RefreshTokenService {

    @Transactional
    void saveTokenInfo(Long userId,String email, String refreshToken, String accessToken);

}