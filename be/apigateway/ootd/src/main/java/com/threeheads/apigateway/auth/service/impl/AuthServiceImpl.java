package com.threeheads.apigateway.auth.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.threeheads.apigateway.auth.jwt.GeneratedToken;
import com.threeheads.apigateway.auth.jwt.JwtUtil;
import com.threeheads.apigateway.auth.service.AuthService;
import com.threeheads.apigateway.auth.service.UserClient;
import com.threeheads.apigateway.redis.domain.RefreshToken;
import com.threeheads.apigateway.redis.repository.RefreshTokenRepository;
import com.threeheads.apigateway.redis.service.RefreshTokenService;
import com.threeheads.apigateway.redis.service.TokenBlacklistService;
import com.threeheads.apigateway.util.GenerateRandomPassword;
import com.threeheads.library.dto.auth.StatusResponseDto;
import com.threeheads.library.dto.auth.kakao.KakaoTokenDto;
import com.threeheads.library.dto.auth.kakao.KakaoUserInfoDto;
import com.threeheads.library.dto.auth.login.reqeust.OriginLoginRequestDto;
import com.threeheads.library.dto.auth.login.response.TokenResponseStatus;
import com.threeheads.library.entity.User;
import com.threeheads.library.enums.Role;
import com.threeheads.library.exception.CustomException;
import com.threeheads.library.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import reactor.core.publisher.Mono;

import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final RefreshTokenRepository tokenRepository;
    private final RefreshTokenService tokenService;
    private final JwtUtil jwtUtil;

    //private final UserRepository userRepository;
    //private final UserFeignClient userFeignClient;  // UserFeignClient 주입
    private final UserClient userClient;



    private final ReactiveUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final Logger log = LoggerFactory.getLogger(getClass());
    private final RestTemplate restTemplate = new RestTemplate(); // RestTemplate 빈 초기화
    private final ObjectMapper objectMapper;
    private final TokenBlacklistService tokenBlacklistService;


    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;

    @Value("${spring.security.oauth2.client.provider.kakao.token-uri}")
    private String tokenUri;

    @Value("${spring.security.oauth2.client.provider.kakao.user-info-uri}")
    private String userInfoUri;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    @Override
    public Mono<ResponseEntity<StatusResponseDto>> logout(String accessToken) {
        return Mono.fromRunnable(() -> {
                    // 액세스 토큰을 블랙리스트에 추가
                    tokenBlacklistService.blacklistToken(accessToken);

                    // 액세스 토큰과 연관된 리프레시 토큰 삭제
                    tokenRepository.deleteByAccessToken(accessToken);

                    log.info("로그아웃 완료. 액세스 토큰을 블랙리스트에 추가하고 리프레시 토큰 삭제 완료. 액세스 토큰: {}", accessToken);
                })
                .then(Mono.just(ResponseEntity.ok(StatusResponseDto.addStatus(HttpStatus.OK.value(), "로그아웃이 성공적으로 처리되었습니다."))))
                .onErrorResume(e -> {
                    if (e instanceof CustomException customException) {
                        log.error("로그아웃 실패. 액세스 토큰: {}, 오류: {}", accessToken, customException.getMessage());
                        return Mono.just(ResponseEntity.status(customException.getErrorCode().getStatus())
                                .body(StatusResponseDto.addStatus(customException.getErrorCode().getStatus(), customException.getErrorCode().getMessage())));
                    } else {
                        log.error("로그아웃 처리 중 예상치 못한 오류 발생. 액세스 토큰: {}, 오류: {}", accessToken, e.getMessage());
                        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(StatusResponseDto.addStatus(HttpStatus.INTERNAL_SERVER_ERROR.value(), "로그아웃 처리 중 서버 오류가 발생했습니다.")));
                    }
                });
    }

//    @Override
//    public Mono<ResponseEntity<TokenResponseStatus>> refresh(String accessToken, String refreshToken) {
//        // 리프레시 토큰 유효성 검사
//        if (!jwtUtil.verifyToken(refreshToken)) {
//            log.warn("리프레시 토큰이 만료되었습니다. 액세스 토큰: {}, 리프레시 토큰: {}", accessToken, refreshToken);
//            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(new TokenResponseStatus(ErrorCode.INVALID_REFRESH_TOKEN.getStatus(), null)));
//        }
//
//        // 리프레시 토큰 정보 조회
//        return tokenRepository.findByAccessToken(accessToken)
//                .flatMap(storedRefreshToken -> {
//                    // 리프레시 토큰이 존재하고, 검증이 성공하면 새로운 액세스 토큰 발급
//                    String newAccessToken = jwtUtil.generateAccessToken(storedRefreshToken.getId(), jwtUtil.getRole(refreshToken)); // 새로운 액세스 토큰 발급
//                    storedRefreshToken.updateAccessToken(newAccessToken); // 리프레시 토큰 정보 업데이트
//
//                    // 리프레시 토큰 정보 저장 후 결과 반환
//                    return tokenRepository.save(storedRefreshToken)
//                            .then(Mono.just(ResponseEntity.ok(new TokenResponseStatus(HttpStatus.OK.value(), newAccessToken))));
//                })
//                .switchIfEmpty(Mono.defer(() -> {
//                    // 리프레시 토큰 정보가 없는 경우
//                    log.info("리프레시 토큰 정보를 찾을 수 없습니다.");
//                    return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                            .body(new TokenResponseStatus(ErrorCode.REDIS_REFRESH_TOKEN_NOT_FOUND.getStatus(), null)));
//                }))
//                .onErrorResume(e -> {
//                    log.error("액세스 토큰 갱신 실패. 액세스 토큰: {}, 리프레시 토큰: {}, 오류: {}", accessToken, refreshToken, e.getMessage());
//                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                            .body(new TokenResponseStatus(ErrorCode.INTERNAL_SERVER_ERROR.getStatus(), null)));
//                });
//    }

    @Override
    public Mono<ResponseEntity<TokenResponseStatus>> refresh(String accessToken, String refreshToken) {
        // 리프레시 토큰 유효성 검사
        if (!jwtUtil.verifyToken(refreshToken)) {
            log.warn("리프레시 토큰이 만료되었습니다. 액세스 토큰: {}, 리프레시 토큰: {}", accessToken, refreshToken);
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenResponseStatus(ErrorCode.INVALID_REFRESH_TOKEN.getStatus(), null)));
        }

        // 리프레시 토큰 정보 조회 (동기식 호출)
        RefreshToken storedRefreshToken = tokenRepository.findByAccessToken(accessToken)
                .orElseThrow(() -> {
                    log.info("리프레시 토큰 정보를 찾을 수 없습니다.");
                    return new CustomException(ErrorCode.REDIS_REFRESH_TOKEN_NOT_FOUND);
                });

        // 리프레시 토큰이 존재하고, 검증이 성공하면 새로운 액세스 토큰 발급
        String newAccessToken = jwtUtil.generateAccessToken(storedRefreshToken.getId(), jwtUtil.getRole(refreshToken));
        storedRefreshToken.updateAccessToken(newAccessToken);

        // 리프레시 토큰 정보 저장 (동기식 호출)
        tokenRepository.save(storedRefreshToken);

        return Mono.just(ResponseEntity.ok(new TokenResponseStatus(HttpStatus.OK.value(), newAccessToken)));
    }

    @Override
    public Mono<ResponseEntity<Map<String, String>>> originLogin(OriginLoginRequestDto loginRequestDto, ServerHttpResponse response) {
        return userDetailsService.findByUsername(loginRequestDto.getUserId())
                .flatMap(userDetails -> {
                    if (!passwordEncoder.matches(loginRequestDto.getPasswordHash(), userDetails.getPassword())) {
                        log.error("비밀번호가 올바르지 않습니다.");
                        return Mono.error(new BadCredentialsException("비밀번호가 올바르지 않습니다."));
                    }

                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    log.info("Authentication successful: {}", authenticationToken);

                    Role role = userDetails.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority)
                            .map(Role::valueOf)
                            .findFirst()
                            .orElseThrow(() -> new BadCredentialsException("권한이 없습니다."));

                    GeneratedToken token = jwtUtil.generateToken(loginRequestDto.getUserId(), role);
                    ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", token.getRefreshToken())
                            .httpOnly(true)
                            .path("/")
                            .maxAge(24 * 60 * 60)
                            .build();
                    response.getHeaders().add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

                    Map<String, String> responseMap = new HashMap<>();
                    responseMap.put("message", "Login successful! Here is your access token.");
                    responseMap.put("accessToken", token.getAccessToken());

                    return Mono.just(ResponseEntity.ok(responseMap));
                })
                .switchIfEmpty(Mono.error(new CustomException(ErrorCode.USER_NOT_FOUND)));
    }

    @Override
    public Mono<KakaoUserInfoDto> requestAccessTokenAndUserInfo(String code) {
        // 카카오 액세스 토큰 요청을 위한 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // 카카오 액세스 토큰 요청을 위한 바디 설정
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("code", code);

        // 카카오 액세스 토큰 요청
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        // 비동기로 카카오 액세스 토큰 요청
        return Mono.fromCallable(() -> restTemplate.postForEntity(tokenUri, request, String.class))
                .flatMap(response -> {
                    log.info("카카오 액세스 토큰 요청: {}", request);

                    // Json으로 파싱
                    KakaoTokenDto kakaoTokenDto;
                    try {
                        kakaoTokenDto = objectMapper.readValue(response.getBody(), KakaoTokenDto.class);
                    } catch (JsonProcessingException e) {
                        log.error("카카오 액세스 토큰 파싱 실패", e);
                        return Mono.error(new CustomException(ErrorCode.KAKAO_TOKEN_PARSING_FAILED));
                    }

                    // 액세스 토큰을 통해 사용자 정보 요청
                    return requestUserInfo(kakaoTokenDto.getAccessToken())
                            .switchIfEmpty(Mono.error(new CustomException(ErrorCode.KAKAO_USER_INFO_NOT_FOUND)));
                })
                .onErrorResume(e -> {
                    log.error("카카오 액세스 토큰 요청 실패", e);
                    return Mono.error(new CustomException(ErrorCode.KAKAO_TOKEN_REQUEST_FAILED));
                });
    }

    @Override
    public Mono<User> kakaoRegisterOrLoginUser(String userEmail) {
        return userClient.findByEmail(userEmail)
                .flatMap(userOptional -> {
                    User user;
                    if (userOptional != null) {
                        // 로그인 처리
                        user = userOptional;
                        log.info("로그인 처리: {}", user);
                    } else {
                        // 회원가입 처리
                        user = User.builder()
                                .email(userEmail)
                                .username(userEmail)
                                .passwordHash(passwordEncoder.encode(GenerateRandomPassword.createRandomPassword())) // 소셜 로그인에서는 사용하지 않는 값 -> 랜덤 값 삽입
                                .role(Role.USER)
                                .socialType("kakao")
                                .attributeKey("")
                                .createdAt(LocalDateTime.now())
                                .build();

                        return userClient.registerUser(user)
                                .then(Mono.just(user)); // 사용자 등록 후 사용자 반환
                    }
                    return Mono.just(user); // 로그인한 사용자 반환
                })
                .onErrorResume(e -> {
                    log.error("회원가입 또는 로그인 처리 중 오류 발생", e);
                    return Mono.error(new CustomException(ErrorCode.LOGIN_OR_REGISTER_FAILED));
                });
    }

    // 쿠키에 리프레시 토큰 저장
    @Override
    public Mono<GeneratedToken> handleKakaoLoginSuccess(String email, ServerHttpResponse response) {
        return kakaoRegisterOrLoginUser(email)
                .flatMap(user -> {
                    GeneratedToken token = jwtUtil.generateToken(user.getEmail(), user.getRole());

                    // 리프레시 토큰을 쿠키에 저장
                    ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", token.getRefreshToken())
                            .httpOnly(true)
                            .path("/")
                            .maxAge(24 * 60 * 60) // 24시간
                            .build();
                    response.getHeaders().add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

                    return Mono.just(token);
                });
    }


    // 액세스 토큰으로 유저 정보 요청
    private Mono<KakaoUserInfoDto> requestUserInfo(String accessToken) {
        // 카카오 유저 정보 요청을 위한 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // 사용자 정보 요청
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);

        // 비동기로 사용자 정보 요청
        return Mono.fromCallable(() -> restTemplate.exchange(
                        userInfoUri,
                        HttpMethod.GET,
                        request,
                        String.class
                ))
                .flatMap(response -> {
                    log.info("카카오로부터 받은 사용자 정보: {}", response.getBody());

                    // Json으로 파싱
                    try {
                        return Mono.just(objectMapper.readValue(response.getBody(), KakaoUserInfoDto.class));
                    } catch (JsonProcessingException e) {
                        log.error("카카오 사용자 정보 파싱 실패", e);
                        return Mono.error(new CustomException(ErrorCode.KAKAO_USER_INFO_PARSING_FAILED));
                    }
                })
                .onErrorResume(e -> {
                    log.error("카카오 사용자 정보 요청 실패", e);
                    return Mono.error(new CustomException(ErrorCode.KAKAO_USER_INFO_REQUEST_FAILED));
                });
    }
}
