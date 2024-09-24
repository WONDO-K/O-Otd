package com.threeheads.apigateway.auth.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.threeheads.apigateway.auth.jwt.GeneratedToken;
import com.threeheads.apigateway.auth.jwt.JwtUtil;
import com.threeheads.apigateway.auth.service.AuthService;
import com.threeheads.apigateway.auth.service.UserService;
import com.threeheads.apigateway.feign.UserFeignClient;
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
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.*;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
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
    private final UserService userService;



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
    public ResponseEntity<StatusResponseDto> logout(String accessToken) {
        try {
            // 액세스 토큰을 블랙리스트에 추가
            tokenBlacklistService.blacklistToken(accessToken);

            // 액세스 토큰과 연관된 리프레시 토큰 삭제
            tokenRepository.deleteByAccessToken(accessToken);

            log.info("로그아웃 완료. 엑세스 토큰을 블랙리스트에 추가하고 리프레시 토큰 삭제 완료. 액세스 토큰: {}", accessToken);
            return ResponseEntity.ok(StatusResponseDto.addStatus(HttpStatus.OK.value(), "로그아웃이 성공적으로 처리되었습니다."));

        } catch (CustomException e) {
            // CustomException 처리
            log.error("로그아웃 실패. 액세스 토큰: {}, 오류: {}", accessToken, e.getMessage());
            return ResponseEntity.status(e.getErrorCode().getStatus())
                    .body(StatusResponseDto.addStatus(e.getErrorCode().getStatus(), e.getErrorCode().getMessage()));

        } catch (Exception e) {
            // 그 외의 모든 예외 처리
            log.error("로그아웃 처리 중 예상치 못한 오류 발생. 액세스 토큰: {}, 오류: {}", accessToken, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StatusResponseDto.addStatus(HttpStatus.INTERNAL_SERVER_ERROR.value(), "로그아웃 처리 중 서버 오류가 발생했습니다."));
        }
    }

    @Override
    public ResponseEntity<TokenResponseStatus> refresh(String accessToken, String refreshToken) {
        try {
//            // 액세스 토큰의 유효성 검사
//            if (!jwtUtil.verifyToken(accessToken)) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(new TokenResponseStatus(ErrorCode.INVALID_PARAMETER.getStatus(), null));
//            }

            // 리프레시 토큰 유효성 검사
            if (!jwtUtil.verifyToken(refreshToken)) {
                // 리프레시 토큰이 만료된 경우, 새로운 액세스 및 리프레시 토큰 발급을 위해 재로그인 유도
                log.warn("리프레시 토큰이 만료되었습니다. 액세스 토큰: {}, 리프레시 토큰: {}", accessToken, refreshToken);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new TokenResponseStatus(ErrorCode.INVALID_REFRESH_TOKEN.getStatus(), null));
            }

            // 리프레시 토큰 정보 조회
            Optional<RefreshToken> storedRefreshToken = tokenRepository.findByAccessToken(accessToken);

            // 리프레시 토큰이 존재하고, 검증이 성공하면 새로운 액세스 토큰 발급
            if (storedRefreshToken.isPresent()) {
                RefreshToken resultToken = storedRefreshToken.get(); // 리프레시 토큰 정보
                String newAccessToken = jwtUtil.generateAccessToken(resultToken.getId(), jwtUtil.getRole(refreshToken)); // 새로운 액세스 토큰 발급
                resultToken.updateAccessToken(newAccessToken); // 리프레시 토큰 정보 업데이트
                tokenRepository.save(resultToken);
                log.info("새로운 액세스 토큰 발급 완료. 사용자 ID: {}, 새로운 액세스 토큰: {}", resultToken.getId(), newAccessToken);
                return ResponseEntity.ok(new TokenResponseStatus(HttpStatus.OK.value(), newAccessToken));
            }

            // 리프레시 토큰 정보가 없는 경우
            log.info("리프레시 토큰 정보를 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new TokenResponseStatus(ErrorCode.REDIS_REFRESH_TOKEN_NOT_FOUND.getStatus(), null));
        } catch (Exception e) {
            log.info("액세스 토큰 갱신 실패. 액세스 토큰: {}, 리프레시 토큰: {}, 오류: {}", accessToken, refreshToken, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new TokenResponseStatus(ErrorCode.INTERNAL_SERVER_ERROR.getStatus(), null));
        }
    }

//    @Override
//    public ResponseEntity<Map<String, String>> originLogin(OriginLoginRequestDto loginRequestDto, ServerHttpResponse response) {
//        Optional<User> user = Optional.ofNullable(userService.findByEmail(loginRequestDto.getUserId()));
//
//        if (user.isEmpty()) {
//            throw new CustomException(ErrorCode.USER_NOT_FOUND);
//        }
//
//        if (!loginRequestDto.getPasswordHash().equals(user.get().getPasswordHash())) {
//            log.error("비밀번호가 올바르지 않습니다.");
//            throw new BadCredentialsException("비밀번호가 올바르지 않습니다.");
//        }
//
//        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequestDto.getUserId());
//        UsernamePasswordAuthenticationToken authenticationToken =
//                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
//
//        log.info("Authentication successful: {}", authenticationToken);
//
//        GeneratedToken token = jwtUtil.generateToken(loginRequestDto.getUserId(), user.get().getRole());
//        log.info("Generated Token: {}", token);
//
//        // 리프레시 토큰을 쿠키에 저장
//        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", token.getRefreshToken())
//                .httpOnly(true)
//                .path("/")
//                .maxAge(24 * 60 * 60) // 24시간
//                .build();
//        response.getHeaders().add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
//
//
//        Map<String, String> responseMap = new HashMap<>();
//        responseMap.put("message", "Login successful! Here is your access token.");
//        responseMap.put("accessToken", token.getAccessToken());
//
//        return ResponseEntity.ok(responseMap);
//    }


@Override
public ResponseEntity<Map<String, String>> originLogin(OriginLoginRequestDto loginRequestDto, ServerHttpResponse response) {
    // 사용자 이메일로 UserDetails를 비동기적으로 조회
    Mono<UserDetails> userDetailsMono = userDetailsService.findByUsername(loginRequestDto.getUserId());

    return userDetailsMono.flatMap(userDetails -> {
                // 비밀번호 확인
                if (!passwordEncoder.matches(loginRequestDto.getPasswordHash(), userDetails.getPassword())) {
                    log.error("비밀번호가 올바르지 않습니다.");
                    throw new BadCredentialsException("비밀번호가 올바르지 않습니다.");
                }

                // 인증 토큰 생성 및 SecurityContext에 설정
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                log.info("Authentication successful: {}", authenticationToken);

                // JWT 토큰 생성
                Role role = userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority) // GrantedAuthority를 String으로 변환
                        .map(Role::valueOf) // String을 Role로 변환 (enum으로 변환)
                        .findFirst()
                        .orElseThrow(() -> new BadCredentialsException("권한이 없습니다."));

                GeneratedToken token = jwtUtil.generateToken(loginRequestDto.getUserId(), role);

                // 리프레시 토큰을 쿠키에 저장
                ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", token.getRefreshToken())
                        .httpOnly(true)
                        .path("/")
                        .maxAge(24 * 60 * 60) // 24시간
                        .build();
                response.getHeaders().add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

                // 응답 생성
                Map<String, String> responseMap = new HashMap<>();
                responseMap.put("message", "Login successful! Here is your access token.");
                responseMap.put("accessToken", token.getAccessToken());

                return Mono.just(ResponseEntity.ok(responseMap));
            }).switchIfEmpty(Mono.error(new CustomException(ErrorCode.USER_NOT_FOUND))) // 사용자 없음 처리
            .block(); // Mono를 차단하여 동기식으로 결과를 가져옴
}


    @Override
    public KakaoUserInfoDto requestAccessTokenAndUserInfo(String code) {
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
        ResponseEntity<String> response;
        try {
            response = restTemplate.postForEntity(tokenUri, request, String.class);
        } catch (Exception e) {
            log.error("카카오 액세스 토큰 요청 실패", e);
            throw new CustomException(ErrorCode.KAKAO_TOKEN_REQUEST_FAILED);
        }

        log.info("카카오 액세스 토큰 요청: {}", request);

        // Json으로 파싱
        // ObjectMapper objectMapper = new ObjectMapper();
        KakaoTokenDto kakaoTokenDto;
        try {
            kakaoTokenDto = objectMapper.readValue(response.getBody(), KakaoTokenDto.class);
        } catch (JsonProcessingException e) {
            log.error("카카오 액세스 토큰 파싱 실패", e);
            throw new CustomException(ErrorCode.KAKAO_TOKEN_PARSING_FAILED);
        }

        // 액세스 토큰을 통해 사용자 정보 요청
        if (kakaoTokenDto != null) {
            return requestUserInfo(kakaoTokenDto.getAccessToken());
        } else {
            log.error("카카오 사용자 정보를 가져오는 데 실패했습니다.");
            throw new CustomException(ErrorCode.KAKAO_USER_INFO_NOT_FOUND);
        }
    }

    @Override
    public User kakaoRegisterOrLoginUser(String userEmail) {
        try {
            Optional<User> userOptional = Optional.ofNullable(userService.findByEmail(userEmail));

            User user;
            if (userOptional.isPresent()) {
                // 로그인 처리
                user = userOptional.get();
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
                userService.registerUser(user);
                log.info("회원가입 처리: {}", user);
            }

            // 토큰 생성 (액세스, 리프레쉬)
            return user;
        } catch (Exception e) {
            log.error("회원가입 또는 로그인 처리 중 오류 발생", e);
            throw new CustomException(ErrorCode.LOGIN_OR_REGISTER_FAILED);
        }
    }
    // 쿠키에 리프레시 토큰 저장
    @Override
    public GeneratedToken handleKakaoLoginSuccess(String email, ServerHttpResponse response) {
        User user = kakaoRegisterOrLoginUser(email);
        GeneratedToken token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        // 리프레시 토큰을 쿠키에 저장
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", token.getRefreshToken())
                .httpOnly(true)
                .path("/")
                .maxAge(24 * 60 * 60) // 24시간
                .build();
        response.getHeaders().add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
        return token;
    }



    // 액세스 토큰으로 유저 정보 요청
    private KakaoUserInfoDto requestUserInfo(String accessToken) {
        try {
            // 카카오 유저 정보 요청을 위한 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + accessToken);
            headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

            // 사용자 정보 요청
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    userInfoUri,
                    HttpMethod.GET,
                    request,
                    String.class
            );
            log.info("카카오로부터 받은 사용자 정보: {}", response.getBody());

            // Json으로 파싱
//            ObjectMapper objectMapper = new ObjectMapper();

            // 카카오로부터 받은 사용자 정보를 KakaoUserInfoDto로 변환
            return objectMapper.readValue(response.getBody(), KakaoUserInfoDto.class);

        } catch (JsonProcessingException e) {
            log.error("카카오 사용자 정보 파싱 실패", e);
            throw new CustomException(ErrorCode.KAKAO_USER_INFO_PARSING_FAILED);
        } catch (Exception e) {
            log.error("카카오 사용자 정보 요청 실패", e);
            throw new CustomException(ErrorCode.KAKAO_USER_INFO_REQUEST_FAILED);
        }
    }

}
