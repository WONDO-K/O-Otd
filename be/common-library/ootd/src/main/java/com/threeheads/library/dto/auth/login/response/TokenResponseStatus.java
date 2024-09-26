package com.threeheads.library.dto.auth.login.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenResponseStatus {
    private int statusCode;
    private String accessToken;

    public static TokenResponseStatus addStatus(int statusCode, String accessToken) {
        return new TokenResponseStatus(statusCode, accessToken);
    }
}