package com.traveleasy.traveleasybackend;

import com.traveleasy.traveleasybackend.models.test;
import com.traveleasy.traveleasybackend.repositories.testRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class TraveleasyBackEndApplication {

	public static void main(String[] args) {
		SpringApplication.run(TraveleasyBackEndApplication.class, args);
	}

}




