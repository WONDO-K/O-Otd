package com.threeheads.user.common.config;

import com.threeheads.user.common.jwt.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // CSRF 비활성화
                .httpBasic(AbstractHttpConfigurer::disable) // httpBasic 비활성화
                .formLogin(AbstractHttpConfigurer::disable) // 폼 로그인 비활성화
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                                "/auth/**","login/oauth2/code/kakao",  // 변경된 경로
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/",
                                "/css/**",
                                "/images/**",
                                "/js/**",
                                "/favicon.ico",
                                "/h2-console/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 추가
                // JwtAuthFilter를 UsernamePasswordAuthenticationFilter 앞에 추가
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    // CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 도커 개발 환경에서 사용, 추후 배포 환경에서 주소 변경 필요
        configuration.setAllowedOrigins(List.of("http://host.docker.internal:8080", "http://localhost:8080")); // 허용할 도메인 설정
        // TODO: 배포 환경에서는 실제 도메인으로 변경 필요
        // 예시: configuration.setAllowedOrigins(List.of("https://yourdomain.com"));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")); // 허용할 HTTP 메서드 설정
        configuration.setAllowedHeaders(List.of("Authorization","refreshToken", "Content-Type", "X-User-ID", "X-User-Role")); // 허용할 헤더 추가

        // 클라이언트가 응답에서 접근할 수 있는 헤더 설정
        configuration.setExposedHeaders(List.of("Authorization", "refreshToken", "X-User-ID", "X-User-Role"));

        configuration.setAllowCredentials(true); // 인증 정보 허용 (쿠키, 인증 관련 정보)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 경로에 대해 CORS 설정 적용
        return source;
    }
}