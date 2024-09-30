package com.threeheads.user.redis.service;

public interface TokenBlacklistService {
    void blacklistToken(String token);
    boolean isTokenBlacklisted(String token);
}