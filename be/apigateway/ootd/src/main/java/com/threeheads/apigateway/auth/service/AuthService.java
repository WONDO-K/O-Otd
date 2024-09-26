package com.threeheads.apigateway.auth.service;


import com.threeheads.apigateway.auth.jwt.GeneratedToken;
import com.threeheads.library.dto.auth.StatusResponseDto;
import com.threeheads.library.dto.auth.kakao.KakaoUserInfoDto;
import com.threeheads.library.dto.auth.login.reqeust.OriginLoginRequestDto;
import com.threeheads.library.dto.auth.login.response.TokenResponseStatus;
import com.threeheads.library.entity.User;

import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpResponse;
import reactor.core.publisher.Mono;

import java.util.Map;

public interface AuthService {

    Mono<ResponseEntity<StatusResponseDto>> logout(String accessToken);
    Mono<ResponseEntity<TokenResponseStatus>> refresh(String accessToken, String refreshToken);
    Mono<ResponseEntity<Map<String, String>>> originLogin(OriginLoginRequestDto loginRequestDto, ServerHttpResponse response);
    Mono<KakaoUserInfoDto> requestAccessTokenAndUserInfo(String code);
    Mono<GeneratedToken> handleKakaoLoginSuccess(String email, ServerHttpResponse response);
    Mono<User> kakaoRegisterOrLoginUser(String userEmail);
}
