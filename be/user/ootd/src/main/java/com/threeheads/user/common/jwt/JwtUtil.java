package com.threeheads.user.common.jwt;

import com.threeheads.library.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
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
    private byte[] secretKey;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getDecoder().decode(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }

//    public boolean verifyToken(String token) {
//        try {
//            Jws<Claims> claims = Jwts.parserBuilder()
//                    .setSigningKey(secretKey)
//                    .build()
//                    .parseClaimsJws(token);
//            return claims.getBody().getExpiration().after(new Date()); // 만료 여부 확인
//        } catch (Exception e) {
//            log.error("Invalid JWT token", e);
//            return false;
//        }
//    }

    public String getUid(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Role getRole(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return Role.valueOf(claims.get("role").toString());
    }
}
