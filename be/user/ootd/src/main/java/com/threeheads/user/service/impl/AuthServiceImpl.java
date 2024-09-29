package com.threeheads.user.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.threeheads.library.dto.auth.StatusResponseDto;
import com.threeheads.user.dto.login.reqeust.OriginLoginRequestDto;
import com.threeheads.library.enums.Role;
import com.threeheads.library.exception.CustomException;
import com.threeheads.library.exception.ErrorCode;
import com.threeheads.user.common.jwt.GeneratedToken;
import com.threeheads.user.common.jwt.JwtProvider;
import com.threeheads.user.common.jwt.JwtUtil;
import com.threeheads.user.dto.kakao.KakaoTokenDto;
import com.threeheads.user.dto.kakao.KakaoUserInfoDto;
import com.threeheads.user.dto.login.response.TokenResponseStatus;
import com.threeheads.user.entity.User;
import com.threeheads.user.redis.domain.RefreshToken;

import com.threeheads.user.redis.repository.RefreshTokenRepository;
import com.threeheads.user.redis.service.TokenBlacklistService;
import com.threeheads.user.repository.UserRepository;
import com.threeheads.user.service.AuthService;
import com.threeheads.user.util.GenerateRandomPassword;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtProvider jwtProvider;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistService tokenBlacklistService;
    private final RefreshTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final Logger log = LoggerFactory.getLogger(getClass());
    private final RestTemplate restTemplate = new RestTemplate(); // RestTemplate 빈 초기화
    private final ObjectMapper objectMapper;

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
            tokenBlacklistService.blacklistToken(accessToken);
            log.info("로그아웃 처리 완료. 액세스 토큰: {}", accessToken);
            return ResponseEntity.ok(StatusResponseDto.addStatus(200, "로그아웃 성공"));
        } catch (CustomException e) {
            log.error("로그아웃 실패: {}", e.getMessage());
            return ResponseEntity.status(e.getErrorCode().getStatus())
                    .body(StatusResponseDto.addStatus(e.getErrorCode().getStatus(), e.getMessage()));
        }
    }

    @Override
    public ResponseEntity<TokenResponseStatus> refresh(String accessToken, String refreshToken) {
        try {
            // 리프레시 토큰 정보 조회 (토큰 저장소에서)
            Optional<RefreshToken> storedRefreshToken = tokenRepository.findByAccessToken(accessToken);

            // 리프레시 토큰이 존재하고, 유효할 경우 새로운 액세스 토큰 발급
            if (storedRefreshToken.isPresent()) {
                RefreshToken resultToken = storedRefreshToken.get();
                String newAccessToken = jwtProvider.generateAccessToken(resultToken.getId().toString(), resultToken.getEmail(), jwtUtil.getRole(refreshToken)); // 새로운 액세스 토큰 발급
                resultToken.updateAccessToken(newAccessToken); // 기존 리프레시 토큰과 함께 저장
                tokenRepository.save(resultToken); // 저장소에 업데이트된 토큰 저장

                log.info("새로운 액세스 토큰 발급 완료. 사용자 ID: {}, 새로운 액세스 토큰: {}", resultToken.getId(), newAccessToken);
                return ResponseEntity.ok(new TokenResponseStatus(HttpStatus.OK.value(), newAccessToken));
            }

            // 리프레시 토큰이 저장소에 없을 경우
            log.info("리프레시 토큰 정보를 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new TokenResponseStatus(400, null));

        } catch (Exception e) {
            log.error("토큰 갱신 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new TokenResponseStatus(500, null));
        }
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
            Optional<User> userOptional = userRepository.findByEmail(userEmail);

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
                userRepository.save(user);
                log.info("회원가입 처리: {}", user);
            }

            // 토큰 생성 (액세스, 리프레쉬)
            return user;
        } catch (Exception e) {
            log.error("회원가입 또는 로그인 처리 중 오류 발생", e);
            throw new CustomException(ErrorCode.LOGIN_OR_REGISTER_FAILED);
        }
    }
//    // 쿠키에 리프레시 토큰 저장
//    @Override
//    public GeneratedToken handleKakaoLoginSuccess(String email, HttpServletResponse response) {
//        User user = kakaoRegisterOrLoginUser(email);
//        GeneratedToken token = jwtProvider.generateToken(user.getEmail(), user.getRole());
//
//        // 리프레시 토큰을 쿠키에 저장 (1시간 동안 유효)
//        Cookie refreshTokenCookie = new Cookie("refreshToken", token.getRefreshToken());
//        refreshTokenCookie.setHttpOnly(true);
//        refreshTokenCookie.setSecure(false);  // HTTPS가 아닌 경우 false로 설정
//        refreshTokenCookie.setPath("/");
//        refreshTokenCookie.setMaxAge(24 * 60 * 60); // 24시간
//        response.addCookie(refreshTokenCookie);
//        log.info("쿠키에 리프래쉬 토큰 저장");
//
//        return token;
//    }

    @Override
    public GeneratedToken handleKakaoLoginSuccess(String email, HttpServletResponse response) {
        log.info("카카오 로그인 성공 처리 진입");
        
        User user = kakaoRegisterOrLoginUser(email);
        GeneratedToken token = jwtProvider.generateToken(user.getId(),user.getEmail(), user.getRole());

        log.info("token: {}", token);

        // JWT 토큰을 이용한 Authentication 객체 생성 (UserDetailsService가 필요 없을 경우)
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                user.getEmail(), // principal
                null, // credentials (비밀번호는 불필요)
                List.of(new SimpleGrantedAuthority(user.getRole().name())) // 사용자 권한 설정
        );

        // SecurityContext에 Authentication 객체 설정
        SecurityContextHolder.getContext().setAuthentication(authentication);

        response.setHeader("X-User-ID", String.valueOf(user.getId()));
        response.setHeader("X-User-Role", String.valueOf(user.getRole()));
        // 액세스 토큰을 헤더에 추가
        response.setHeader("accessToken", token.getAccessToken());

        // 리프레시 토큰을 헤더에 추가
        response.setHeader("refreshToken", token.getRefreshToken());
        // do
        log.info("리프레시 토큰을 헤더에 추가");

        // 로깅 추가: 헤더에 토큰 및 사용자 정보가 잘 담겼는지 확인
        log.info("응답 헤더에 설정된 X-User-ID: {}", response.getHeader("X-User-ID"));
        log.info("응답 헤더에 설정된 X-User-Role: {}", response.getHeader("X-User-Role"));
        log.info("응답 헤더에 설정된 Access Token: {}", response.getHeader("accessToken"));
        log.info("응답 헤더에 설정된 Refresh Token: {}", response.getHeader("refreshToken"));

        log.info("사용자 정보 추가: ID={}, Role={}", user.getId(), user.getRole());


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