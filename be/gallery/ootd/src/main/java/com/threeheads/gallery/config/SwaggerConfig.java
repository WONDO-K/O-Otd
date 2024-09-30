package com.threeheads.gallery.config;

import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;

@OpenAPIDefinition(
        info = @Info(
                title = "Gallery Service API",
                version = "v1",
                description = "Gallery Service Application API",
                contact = @Contact(name = "201104", email = "your.email@example.com")
        ),
        servers = @Server(
                url = "http://localhost:8080/gallery-service", // API Gateway에서 gallery 서비스로 라우팅된 경로
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