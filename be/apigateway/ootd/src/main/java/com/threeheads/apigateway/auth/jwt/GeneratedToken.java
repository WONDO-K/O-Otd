package com.threeheads.apigateway.auth.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GeneratedToken {
    private String accessToken;
    private String refreshToken;
}