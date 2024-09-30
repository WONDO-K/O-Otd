package com.threeheads.apigateway.common;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "API Gateway",
                version = "v1",
                description = "Unified and Grouped API Gateway for O-Otd Services",
                contact = @Contact(name = "Your Name", email = "your.email@example.com")
        ),
        servers = @Server(
                url = "http://localhost:8080", // API Gateway URL
                description = "API Gateway Server URL"
        )
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

    @Bean
    public OpenAPI OpenAPI() {
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new io.swagger.v3.oas.models.security.SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                                .scheme(BEARER_TOKEN_PREFIX)
                                .bearerFormat("JWT")));
    }

    // 단일 페이지로 모든 마이크로서비스 API 통합
    @Bean
    public GroupedOpenApi unifiedApi() {
        return GroupedOpenApi.builder()
                .group("all-services")  // 단일 페이지에 모든 서비스를 포함
                .pathsToMatch("/user-service/**", "/gallery-service/**")  // 각 마이크로서비스의 실제 API 경로
                .pathsToExclude("/user-service/auth/**") // 인증 경로는 문서에서 제외

                .build();
    }
//
//    // 각 서비스별로 그룹화된 API
//    @Bean
//    public GroupedOpenApi userServiceApi() {
//        return GroupedOpenApi.builder()
//                .group("user-service")  // 그룹화된 User 서비스 API
//                .pathsToMatch("/user-service/**")
//                .build();
//    }
//
//    @Bean
//    public GroupedOpenApi galleryServiceApi() {
//        return GroupedOpenApi.builder()
//                .group("gallery-service")  // 그룹화된 Gallery 서비스 API
//                .pathsToMatch("/gallery-service/**")
//                .build();
//    }

}
