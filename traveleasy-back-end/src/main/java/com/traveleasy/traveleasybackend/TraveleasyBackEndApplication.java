 package com.traveleasy.traveleasybackend;

import com.traveleasy.traveleasybackend.configs.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;


 @SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class TraveleasyBackEndApplication {

	public static void main(String[] args) {
		SpringApplication.run(TraveleasyBackEndApplication.class, args);
	}

}




