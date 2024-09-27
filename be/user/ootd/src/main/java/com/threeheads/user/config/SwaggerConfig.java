package com.threeheads.user.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "User Service API",
                version = "v1",
                description = "User Service Application API",
                contact = @Contact(name = "201104", email = "your.email@example.com")
        ),
        servers = @Server(
                url = "http://localhost:8081", // API Gateway에서 user 서비스로 라우팅된 경로
                description = "API Gateway URL for User Service"
        ),
        security = {
                @SecurityRequirement(name = SwaggerConfig.SECURITY_SCHEME_NAME) // 모든 경로에 JWT 보안 스키마 적용
        }
)
@SecurityScheme(
        name = SwaggerConfig.SECURITY_SCHEME_NAME,
        type = SecuritySchemeType.HTTP,
        scheme = SwaggerConfig.BEARER_TOKEN_PREFIX, // Bearer 토큰 접두어 유지
        bearerFormat = "JWT"
)
public class SwaggerConfig {

    public static final String BEARER_TOKEN_PREFIX = "bearer";
    public static final String SECURITY_SCHEME_NAME = "Bearer Authentication";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement().addList(SECURITY_SCHEME_NAME)) // 보안 요구 사항 설정
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new io.swagger.v3.oas.models.security.SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                                .scheme(BEARER_TOKEN_PREFIX) // Bearer 토큰 설정
                                .bearerFormat("JWT")));
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .pathsToMatch("/**")
                .build();
    }
}
