package com.threeheads.apigateway.common;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "API Gateway",
                version = "v1",
                description = "API Gateway for O-Otd Services",
                contact = @Contact(name = "Your Name", email = "your.email@example.com")
        ),
        servers = @Server(
                url = "http://localhost:8080", // API Gateway URL
                description = "API Gateway Server URL"
        ),
        security = {
                @SecurityRequirement(name = "Bearer Authentication") // 모든 엔드포인트에 JWT 인증 적용
        }
)
@SecurityScheme(
        name = "Bearer Authentication",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class SwaggerConfig {

    private static final String BEARER_TOKEN_PREFIX = "Bearer";
    private static final String SECURITY_SCHEME_NAME = "Bearer Authentication";

    /**
     * OpenAPI 정의 및 JWT 보안 스키마 설정
     */
    @Bean
    public OpenAPI gatewayOpenAPI() {
        return new OpenAPI()
                .addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement().addList(SECURITY_SCHEME_NAME)) // 보안 요구 사항 설정
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new io.swagger.v3.oas.models.security.SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                                .scheme(BEARER_TOKEN_PREFIX) // Bearer 토큰 설정
                                .bearerFormat("JWT")));
    }

    /**
     * GroupedOpenApi 정의: Gateway API
     */
    @Bean
    public GroupedOpenApi gatewayServiceApi() {
        return GroupedOpenApi.builder()
                .group("gateway-service")
                .pathsToMatch("/auth/**") // Gateway의 소셜 로그인 등의 엔드포인트를 포함
                .build();
    }

    /**
     * GroupedOpenApi 정의: User Service API
     */
    @Bean
    public GroupedOpenApi userServiceApi() {
        return GroupedOpenApi.builder()
                .group("user-service")
                .pathsToMatch("/user-service/**", "/user-client/**")  // 유저 서비스 경로
                .build();
    }

    /**
     * GroupedOpenApi 정의: Gallery Service API
     */
    @Bean
    public GroupedOpenApi galleryServiceApi() {
        return GroupedOpenApi.builder()
                .group("gallery-service")
                .pathsToMatch("/gallery-service/**") // 갤러리 서비스 경로
                .build();
    }
}
