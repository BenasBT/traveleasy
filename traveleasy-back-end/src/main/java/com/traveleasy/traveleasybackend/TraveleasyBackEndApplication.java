package com.traveleasy.traveleasybackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class TraveleasyBackEndApplication {

	public static void main(String[] args) {
		SpringApplication.run(TraveleasyBackEndApplication.class, args);
	}

	@GetMapping("/")
	String hello(){
		return "Hello Clients";
	}

}
