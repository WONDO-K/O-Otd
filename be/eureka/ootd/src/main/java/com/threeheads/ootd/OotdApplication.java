package com.threeheads.ootd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer  // Eureka 서버 활성화
public class OotdApplication {

	public static void main(String[] args) {
		SpringApplication.run(OotdApplication.class, args);
	}

}
