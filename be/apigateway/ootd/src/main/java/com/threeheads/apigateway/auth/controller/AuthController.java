package com.threeheads.apigateway.auth.controller;

import com.threeheads.apigateway.auth.jwt.GeneratedToken;
import com.threeheads.apigateway.auth.service.AuthService;
import com.threeheads.library.dto.auth.StatusResponseDto;
import com.threeheads.library.dto.auth.kakao.KakaoUserInfoDto;
import com.threeheads.library.dto.auth.login.reqeust.OriginLoginRequestDto;
import com.threeheads.library.dto.auth.login.response.TokenResponseStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;

import java.util.HashMap;
import java.util.Map;

//@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Tag(name = "AuthController", description = "인증 관련 API")
public class AuthController {

    private final AuthService authService;
    private final Logger log = LoggerFactory.getLogger(getClass());


    @PostMapping("/origin/login")
    @Operation(summary = "자체 로그인", description = "이메일, 비밀번호로 로그인")
    public ResponseEntity<Map<String, String>> originLogin(@RequestBody OriginLoginRequestDto loginRequestDto, ServerHttpResponse response) {
        return authService.originLogin(loginRequestDto, response);
    }

    @PostMapping("/token/logout")
    @Operation(summary = "로그아웃", description = "로그아웃 처리 및 토큰 삭제")
    public ResponseEntity<StatusResponseDto> logout(ServerWebExchange exchange) {
        // HTTP 요청에서 액세스 토큰 헤더를 추출
        String accessTokenHeader = exchange.getRequest().getHeaders().getFirst("Authorization");

        // 액세스 토큰이 없으면 오류 반환
        if (accessTokenHeader == null || !accessTokenHeader.startsWith("Bearer ")) {
            log.error("로그아웃 요청에 유효한 액세스 토큰이 없습니다.");
            return ResponseEntity.badRequest()
                    .body(StatusResponseDto.addStatus(400, "유효한 액세스 토큰이 없습니다."));
        }
        // 'Bearer ' 접두사 제거
        String accessToken = accessTokenHeader.substring(7);

        // 로그아웃 처리: 액세스 토큰을 블랙리스트에 추가하고, 연관된 리프레시 토큰 삭제
        return authService.logout(accessToken);
    }


    @PostMapping("/token/refresh")
    @Operation(summary = "토큰 갱신", description = "액세스 토큰을 갱신")
    public ResponseEntity<TokenResponseStatus> refresh(ServerWebExchange exchange) {

        // Authorization 헤더에서 액세스 토큰 추출
        String accessTokenHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        String accessToken = null;

        log.info("전달 받은 accessToken: " + accessTokenHeader);

        if (accessTokenHeader != null && accessTokenHeader.startsWith("Bearer ")) {
            accessToken = accessTokenHeader.substring(7);
        }

        // 쿠키에서 리프레시 토큰 추출
        String refreshToken = exchange.getRequest().getCookies().getFirst("refreshToken") != null ?
                exchange.getRequest().getCookies().getFirst("refreshToken").getValue() : null;


        log.info("전달 받은 refreshToken: " + refreshToken);

        // refreshToken이 없거나 accessToken이 없으면 오류 반환
        if (accessToken == null || accessToken.trim().isEmpty() || refreshToken == null || refreshToken.trim().isEmpty()) {
            log.error("Access Token or Refresh Token is missing");
            return ResponseEntity.badRequest().body(new TokenResponseStatus(400, null));
        }

        // 토큰 갱신 서비스 호출
        return authService.refresh(accessToken, refreshToken);
    }

    // 카카오 로그인 처리 메서드
    @GetMapping("/kakao/login")
    @Operation(summary = "카카오 로그인", description = "카카오 인가 코드를 받아 로그인 처리")
    public ResponseEntity<Map<String, String>> kakaoLogin(@RequestParam String code, ServerHttpResponse response) {
        try {
            KakaoUserInfoDto kakaoUserInfoDto = authService.requestAccessTokenAndUserInfo(code);

            if (kakaoUserInfoDto == null || kakaoUserInfoDto.getKakaoAccount().getEmail() == null) {
                log.error("카카오 사용자 정보를 가져오는 데 실패했습니다.");
                return ResponseEntity.status(400).body(Map.of("error", "카카오 사용자 정보를 가져오는 데 실패했습니다."));
            }

            // 사용자 등록 또는 로그인 처리
            GeneratedToken token = authService.handleKakaoLoginSuccess(kakaoUserInfoDto.getKakaoAccount().getEmail(), response);
            // 액세스 토큰을 응답으로 반환
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("accessToken", token.getAccessToken());
            return ResponseEntity.ok(responseBody);

        } catch (Exception e) {
            log.error("카카오 로그인 처리 중 오류 발생", e);
            return ResponseEntity.status(500).body(Map.of("error", "카카오 로그인 처리 중 오류 발생"));
        }
    }
}
