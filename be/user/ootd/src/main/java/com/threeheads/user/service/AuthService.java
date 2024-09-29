package com.threeheads.user.service;



import com.threeheads.library.dto.auth.StatusResponseDto;
import com.threeheads.user.dto.login.reqeust.OriginLoginRequestDto;
import com.threeheads.user.common.jwt.GeneratedToken;
import com.threeheads.user.dto.kakao.KakaoUserInfoDto;
import com.threeheads.user.dto.login.response.TokenResponseStatus;
import com.threeheads.user.entity.User;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface AuthService {

    ResponseEntity<StatusResponseDto> logout(String accessToken);
    ResponseEntity<TokenResponseStatus> refresh(String accessToken, String refreshToken);
    KakaoUserInfoDto requestAccessTokenAndUserInfo(String code);
    GeneratedToken handleKakaoLoginSuccess(String email, HttpServletResponse response);
    User kakaoRegisterOrLoginUser(String userEmail);
}
