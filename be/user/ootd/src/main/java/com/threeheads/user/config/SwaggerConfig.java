package com.threeheads.user.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                title = "User Service API",
                version = "v1",
                description = "User Service Application API",
                contact = @Contact(name = "201104", email = "your.email@example.com")
        ),
        servers = @Server(
                url = "http://localhost:8080/user-service", // API Gateway에서 user 서비스로 라우팅된 경로
                description = "API Gateway URL for Gallery Service"
        )
)
@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .pathsToMatch("/**")
                .build();
    }
}