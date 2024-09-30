package com.threeheads.user.common.jwt;

import com.threeheads.library.enums.Role;
import com.threeheads.user.redis.service.RefreshTokenService;
import io.jsonwebtoken.Claims;
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
public class JwtProvider {

    private final Logger log = LoggerFactory.getLogger(getClass());
    private final JwtProperties jwtProperties;
    private final RefreshTokenService refreshTokenService;
    private byte[] secretKey;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getDecoder().decode(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    public GeneratedToken generateToken(Long userId,String email, Role role) {
        String refreshToken = generateRefreshToken(userId.toString(),email, role);
        String accessToken = generateAccessToken(userId.toString(),email, role);
        log.info("Generated Access Token: {}", accessToken);
        log.info("Generated Refresh Token: {}", refreshToken);

        refreshTokenService.saveTokenInfo(userId, email, refreshToken, accessToken); // Refresh Token 관리 서비스 호출

        return new GeneratedToken(accessToken, refreshToken);
    }

    public String generateRefreshToken(String userId, String email, Role role) {
        long refreshPeriod = 1000L * 60L * 60L * 24L * 7; // 1주일 유효
        Claims claims = Jwts.claims().setSubject(userId);
        claims.put("email", email);  // email을 별도 클레임으로 저장
        claims.put("role", role);
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + refreshPeriod))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }
    public String generateAccessToken(String userId, String email, Role role) {
        long tokenPeriod = 1000L * 60L * 30L; // 30분 유효
        Claims claims = Jwts.claims().setSubject(userId);  // userId를 subject로 설정
        claims.put("email", email);  // email을 별도 클레임으로 저장
        claims.put("role", role);    // role을 별도 클레임으로 저장
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims)  // 클레임 설정
                .setIssuedAt(now)   // 발급 시간 설정
                .setExpiration(new Date(now.getTime() + tokenPeriod))  // 만료 시간 설정
                .signWith(SignatureAlgorithm.HS512, secretKey)  // 비밀키로 서명
                .compact();  // 토큰 생성
    }



//    public String generateAccessToken(String email, Role role) {
//        long tokenPeriod = 1000L * 60L * 30L; // 30분 유효
//        Claims claims = Jwts.claims().setSubject(email);
//        claims.put("role", role);
//        Date now = new Date();
//        return Jwts.builder()
//                .setClaims(claims)
//                .setIssuedAt(now)
//                .setExpiration(new Date(now.getTime() + tokenPeriod))
//                .signWith(SignatureAlgorithm.HS512, secretKey)
//                .compact();
//    }

}
