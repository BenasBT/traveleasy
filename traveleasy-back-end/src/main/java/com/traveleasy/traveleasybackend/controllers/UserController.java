package com.traveleasy.traveleasybackend.controllers;

import com.traveleasy.traveleasybackend.exeption.ResourceNotFoundException;
import com.traveleasy.traveleasybackend.models.AuthProvider;
import com.traveleasy.traveleasybackend.models.entities.UserEntity;
import com.traveleasy.traveleasybackend.payload.EditUserRequest;
import com.traveleasy.traveleasybackend.repositories.UserRepository;
import com.traveleasy.traveleasybackend.security.CurrentUser;
import com.traveleasy.traveleasybackend.security.UserPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Email;
@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    @PreAuthorize("hasRole('ROLE_USER')")
    public UserEntity getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public UserEntity getUser(@PathVariable("id") Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

    }

    @PatchMapping(value = "/", consumes = "application/json")
    @PreAuthorize("hasRole('ROLE_USER')")
    public UserEntity editUser(@Valid @RequestBody EditUserRequest request,
                               @CurrentUser UserPrincipal user) {
        UserEntity user1 =  userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", user.getId()));

        if(user1.getProvider() != AuthProvider.local
                && !user1.getEmail().equals(request.getEmail())) {
            log.error("Cant change email for this account");
        }else {
            user1.setEmail(request.getEmail());
        }
            user1.setName(request.getName());

            userRepository.save(user1);

        return user1;
    }
}
