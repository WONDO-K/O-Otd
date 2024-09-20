package com.threeheads.apigateway.auth.service;


import com.threeheads.apigateway.auth.jwt.GeneratedToken;
import com.threeheads.library.dto.auth.StatusResponseDto;
import com.threeheads.library.dto.auth.kakao.KakaoUserInfoDto;
import com.threeheads.library.dto.auth.login.reqeust.OriginLoginRequestDto;
import com.threeheads.library.dto.auth.login.response.TokenResponseStatus;
import com.threeheads.library.entity.User;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface AuthService {

    ResponseEntity<StatusResponseDto> logout(String accessToken);
    ResponseEntity<TokenResponseStatus> refresh(String accessToken, String refreshToken);
    ResponseEntity<Map<String, String>> originLogin(OriginLoginRequestDto loginRequestDto, HttpServletResponse response);
    KakaoUserInfoDto requestAccessTokenAndUserInfo(String code);
    GeneratedToken handleKakaoLoginSuccess(String email, HttpServletResponse response);
    User kakaoRegisterOrLoginUser(String userEmail);

}
