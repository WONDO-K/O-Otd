package com.threeheads.battle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableDiscoveryClient
public class BattleServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BattleServiceApplication.class, args);
	}

}
