package com.threeheads.apigateway.common;

import com.threeheads.apigateway.auth.jwt.JwtAuthFilter;
import com.threeheads.apigateway.auth.jwt.JwtLoggingFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final JwtLoggingFilter jwtLoggingFilter;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)  // CSRF 비활성화
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)  // 기본 인증 비활성화
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)  // 폼 로그인 비활성화
                .authorizeExchange(exchange -> exchange
                        .pathMatchers("/swagger-ui/**", "/v3/api-docs/**", "/user-service/swagger-ui/**", "/user-service/v3/api-docs/**", "/gallery-service/swagger-ui/**", "/gallery-service/v3/api-docs/**").permitAll()  // 모든 서비스의 Swagger UI 및 API 문서 경로 허용
                        .pathMatchers("/user-service/auth/**").permitAll()  // 인증이 필요 없는 경로 설정
                        .pathMatchers("/user-service/**", "/gallery-service/**").authenticated()  // 인증이 필요한 경로 설정
                        .anyExchange().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, SecurityWebFiltersOrder.AUTHORIZATION)  // JwtAuthFilter 추가
                .addFilterBefore(jwtLoggingFilter, SecurityWebFiltersOrder.AUTHORIZATION)  // 로그 필터 추가
                .cors(withDefaults());  // CORS 기본 설정 추가
        return http.build();
    }



    // CORS 설정
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // 로컬 개발 환경의 도메인 및 포트 설정
        config.setAllowedOrigins(List.of("http://localhost:8080", "http://localhost:8081"));
        // 추후 실제 서비스 배포 시에는 아래와 같이 실제 도메인으로 변경해야 함
        // config.setAllowedOrigins(List.of("https://domain.com"));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // 클라이언트가 요청할 수 있는 헤더 목록
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-User-ID", "X-User-Role"));

        // 클라이언트가 응답에서 접근할 수 있는 헤더 목록
        config.setExposedHeaders(List.of("Authorization", "refreshToken", "X-User-ID", "X-User-Role"));

        config.setAllowCredentials(true);  // 쿠키 및 인증 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);  // 모든 경로에 CORS 설정 적용

        return new CorsWebFilter(source);
    }

}
