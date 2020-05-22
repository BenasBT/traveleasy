package com.traveleasy.traveleasybackend.payload;

import lombok.Data;

import javax.validation.constraints.Email;

@Data
public class EditUserRequest {

    private String name;

    @Email
    private String email;
}
