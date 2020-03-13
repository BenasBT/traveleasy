package com.traveleasy.traveleasybackend.payload;

import com.traveleasy.traveleasybackend.models.AuthProvider;
import lombok.Data;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class RegisterRequest {

    @NotBlank
    String name;

    @NotBlank
    @Email
    String email;

    @NotBlank
    String password;

}
