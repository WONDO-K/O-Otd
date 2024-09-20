package com.threeheads.apigateway.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    @LoadBalanced // Eureka 사용 시 로드 밸런싱을 위해 추가
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
