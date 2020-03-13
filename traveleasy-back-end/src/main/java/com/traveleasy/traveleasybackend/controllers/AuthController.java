package com.traveleasy.traveleasybackend.controllers;

import com.traveleasy.traveleasybackend.models.AuthProvider;
import com.traveleasy.traveleasybackend.payload.ApiResponse;
import com.traveleasy.traveleasybackend.payload.AuthResponse;
import com.traveleasy.traveleasybackend.security.JwtTokenProvider;
import com.traveleasy.traveleasybackend.models.RoleName;
import com.traveleasy.traveleasybackend.models.entities.RoleEntity;
import com.traveleasy.traveleasybackend.models.entities.UserEntity;
import com.traveleasy.traveleasybackend.repositories.RoleRepository;
import com.traveleasy.traveleasybackend.repositories.UserRepository;
import com.traveleasy.traveleasybackend.payload.LoginRequest;
import com.traveleasy.traveleasybackend.payload.RegisterRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.security.Principal;
import java.util.Collections;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    ResponseEntity<?> Login(@Valid @RequestBody LoginRequest loginRequest){

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new AuthResponse(jwt));
    }

    @PostMapping("/register")
    ResponseEntity<?> Register(@Valid @RequestBody RegisterRequest registerRequest){
        if(userRepository.existsByEmail(registerRequest.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email Address already in use!",
                    HttpStatus.BAD_REQUEST);
        }

        UserEntity userEntity = new UserEntity(registerRequest.getName(),
                registerRequest.getEmail(), registerRequest.getPassword());

        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));

        RoleEntity RoleEntity = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("User Role not set."));

        userEntity.setRoleEntities(Collections.singleton(RoleEntity));
        userEntity.setProvider(AuthProvider.local);
        UserEntity result = userRepository.save(userEntity);


        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/users/me")
                .buildAndExpand(result.getName()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "User registered successfully@"));

    }



}
