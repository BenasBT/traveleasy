package com.traveleasy.traveleasybackend.models.entities;

import com.traveleasy.traveleasybackend.models.AuthProvider;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "users",uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
public class UserEntity extends AbstractEntity{

    @Column(name = "name",nullable = false)
    private String name;

    @Email
    @Column(name = "email",nullable = false)
    private String email;


    @Column(name = "email_verified",nullable = false)
    private Boolean emailVerified = false;

    @Column(name = "password")
    private String password;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<RoleEntity> roleEntities = new HashSet<>();

    @NotNull
    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "image_url")
    private String imageUrl;

    public UserEntity(String name, String email, String password) {
        this.name =name;
        this.email = email;
        this.password =password;
    }

    public UserEntity() {
    }
}
