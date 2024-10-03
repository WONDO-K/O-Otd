package com.threeheads.user.common.jwt;

import com.threeheads.library.dto.auth.security.SecurityUserDto;

import com.threeheads.user.entity.User;
import com.threeheads.user.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;


import java.io.IOException;
import java.util.Enumeration;
import java.util.List;
@RequiredArgsConstructor
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final Logger log = LoggerFactory.getLogger(getClass());
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("JwtAuthFilter 실행됨");

        // 헤더에서 사용자 정보를 가져옴 (게이트웨이에서 전달됨)
        String userId = request.getHeader("X-User-ID");
        String role = request.getHeader("X-User-Role");
        log.info("사용자 정보: ID={}, Role={}", userId, role);

        if (!StringUtils.hasText(userId) || !StringUtils.hasText(role)) {
            log.info("유저 정보가 없습니다. 필터를 통과합니다.");
            filterChain.doFilter(request, response);
            return;
        }

        // DB에서 유저 정보를 조회
        User findUser = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("유효하지 않은 사용자 ID입니다: " + userId));

        // SecurityUserDto를 생성하여 UserDetails로 등록
        SecurityUserDto userDto = SecurityUserDto.builder()
                .id(findUser.getId())
                .email(findUser.getEmail())
                .username(findUser.getUsername())
                .role(findUser.getRole())
                .build();

        // UserDetails로 Authentication 객체 생성 및 SecurityContext에 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDto, null, userDto.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
        log.info("SecurityContext에 인증 객체 등록 완료: {}", findUser.getEmail());

        filterChain.doFilter(request, response);
    }
    public static SecurityUserDto getUser() {
        return (SecurityUserDto) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // 특정 경로에 대해서 필터를 적용하지 않도록 설정
    // 로그인, 회원가입 등의 경우에는 필터를 적용하지 않음
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // /auth/ 또는 /user-service/auth/ 경로에 대해서는 필터를 적용하지 않음
        String requestURI = request.getRequestURI();
        log.info("Request URI: " + requestURI);
        return requestURI.startsWith("/auth/");
    }
}
