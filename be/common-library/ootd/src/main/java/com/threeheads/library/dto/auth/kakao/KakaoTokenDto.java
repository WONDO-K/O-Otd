package com.threeheads.library.dto.auth.kakao;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;


@Data
public class KakaoTokenDto {

    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("token_type")
    private String tokenType;

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonProperty("expires_in")
    private int expiresIn;

    private String scope;

    @JsonProperty("refresh_token_expires_in")
    private int refreshTokenExpiresIn;
}
