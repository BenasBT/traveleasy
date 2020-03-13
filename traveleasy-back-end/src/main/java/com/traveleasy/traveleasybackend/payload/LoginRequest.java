package com.traveleasy.traveleasybackend.payload;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class LoginRequest {

    @NotBlank
    String email;

    @NotBlank
    String password;
}
