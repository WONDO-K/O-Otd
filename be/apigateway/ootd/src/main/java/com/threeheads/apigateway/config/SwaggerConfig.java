package com.threeheads.apigateway.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
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
        )
)
public class SwaggerConfig {
    @Bean
    public GroupedOpenApi galleryServiceApi() {
        return GroupedOpenApi.builder()
                .group("gallery-service")
                .pathsToMatch("/gallery-service/**") // Gateway를 통해 접근 가능한 gallery-service의 경로
                .build();
    }

    @Bean
    public GroupedOpenApi userServiceApi() {
        return GroupedOpenApi.builder()
                .group("user-service")
                .pathsToMatch("/user-service/**") // 다른 서비스 경로도 추가
                .build();
    }
}