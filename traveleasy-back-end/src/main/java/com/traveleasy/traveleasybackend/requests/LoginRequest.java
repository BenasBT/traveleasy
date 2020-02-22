package com.traveleasy.traveleasybackend.requests;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class LoginRequest {

    @NotBlank
    String usernameOrEmail;
    @NotBlank
    String password;
}
