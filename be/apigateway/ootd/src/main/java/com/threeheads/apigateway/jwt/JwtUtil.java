package com.threeheads.apigateway.jwt;


import com.threeheads.apigateway.redis.service.RefreshTokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtUtil {

    private final Logger log = LoggerFactory.getLogger(getClass());

    private final JwtProperties jwtProperties;
    private final RefreshTokenService refreshTokenService; // RefreshToken 관리 서비스
    private byte[] secretKey;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getDecoder().decode(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    // JWT 토큰 생성 로직 (AccessToken과 RefreshToken 생성)
    public GeneratedToken generateToken(String email, Role role) {
        String refreshToken = generateRefreshToken(email, role);
        String accessToken = generateAccessToken(email, role);
        refreshTokenService.saveTokenInfo(email, refreshToken, accessToken); // Refresh Token 관리 서비스 호출

        log.info("Generated Access Token: {}", accessToken);
        log.info("Generated Refresh Token: {}", refreshToken);

        return new GeneratedToken(accessToken, refreshToken);
    }

    // RefreshToken 생성 로직
    public String generateRefreshToken(String email, Role role) {
        long refreshPeriod = 1000L * 60L * 60L * 24L * 7; // 1주일 유효
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("role", role);
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + refreshPeriod))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    // AccessToken 생성 로직
    public String generateAccessToken(String email, Role role) {
        long tokenPeriod = 1000L * 60L * 30L; // 30분 유효
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("role", role);
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + tokenPeriod))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    // JWT 토큰 검증 로직
    public boolean verifyToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return claims.getBody().getExpiration().after(new Date()); // 만료 여부 확인
        } catch (Exception e) {
            log.error("Invalid JWT token", e);
            return false;
        }
    }

    // 토큰에서 사용자 Email을 추출하는 메서드
    public String getUid(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 토큰에서 사용자 Role을 추출하는 메서드
    public Role getRole(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return Role.valueOf(claims.get("role").toString());
    }

    // 회원가입용 토큰 생성 (필요 시 추가 기능)
    public String generateTokenForSignup(String email, String provider) {
        long signupTokenPeriod = 1000L * 60L * 15L;
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("provider", provider);
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + signupTokenPeriod))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }
}
