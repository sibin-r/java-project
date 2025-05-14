package com.charity.charity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;



@EnableJpaRepositories(basePackages = "com.charity.charity.repository")
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class CharityApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(CharityApplication.class, args);
	}

}
