package com.threeheads.battle.common.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
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

        // 헤더에서 사용자 정보를 가져옴
        String userId = request.getHeader("X-User-ID");
        String role = request.getHeader("X-User-Role");
        log.info("사용자 정보: ID={}, Role={}", userId, role);

        // 사용자 정보가 없으면 필터 통과
        if (userId == null || role == null) {
            log.info("유저 정보가 없습니다. 필터를 통과합니다.");
            filterChain.doFilter(request, response);
            return;
        }

        // 추가 로직을 여기에 추가 (예: 유저 정보 로드 또는 로그)

        filterChain.doFilter(request, response);
    }
}