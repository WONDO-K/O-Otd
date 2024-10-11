package com.threeheads.gallery.common.jwt;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Enumeration;

@RequiredArgsConstructor
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 모든 헤더 정보를 로그로 출력
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            log.info("들어온 Header: {} = {}", headerName, request.getHeader(headerName));
        }

        // Authorization 헤더에서 JWT 토큰을 추출
        String jwtToken = extractToken(request);
        log.info("JWT 토큰: {}", jwtToken);
        if (!StringUtils.hasText(jwtToken)) {
            log.warn("토큰이 없습니다. 요청을 차단합니다.");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // 401 에러 반환
            response.getWriter().write("액세스 토큰이 필요합니다.");
            return;
        }

        // JWT 토큰이 존재하는 경우 필터 통과
        filterChain.doFilter(request, response);
    }

    // Authorization 헤더에서 토큰 추출하는 메서드
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 이후의 실제 토큰 값 반환
        }
        return null;
    }
}
