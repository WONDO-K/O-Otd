package com.threeheads.user.common;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Map;

@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;

    // 생성자를 통한 jwt.secret 주입
    public JwtTokenProvider(@Value("${jwt.secret}") String secret) {
        // 주입받은 비밀 키로 SecretKey 생성
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // JWT 토큰에서 Claims 추출
    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)  // SecretKey로 서명 키 설정
                .build()  // JwtParserBuilder 빌드
                .parseClaimsJws(token)
                .getBody();  // Claims(유저 정보 및 역할) 반환
    }

    // JWT 토큰에서 유저 정보 추출
    public Map<String, Object> getUserInfoFromToken(String token) {
        return getClaimsFromToken(token);  // Claims를 바로 반환
    }
}
