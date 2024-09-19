package com.threeheads.gallery.config;

import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Gallery Service API", // API 제목 변경
                version = "v1",
                description = "Gallery Service Application API", // 설명 변경
                contact = @Contact(name = "201104", email = "your.email@example.com")
        ),
        servers = @Server(
                url = "http://localhost:8080", // API Gateway URL로 설정
                description = "API Gateway Server URL"
        )
)
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public") // 'public' 그룹으로 모든 API 포함
                .pathsToMatch("/**") // 모든 경로 포함
                .build();
    }
}