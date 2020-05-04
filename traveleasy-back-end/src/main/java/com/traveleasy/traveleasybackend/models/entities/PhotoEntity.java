package com.traveleasy.traveleasybackend.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "photos")
public class PhotoEntity extends AbstractEntity {

    @Column(name = "name")
    private String name;

    @Column(name = "dir")
    private String dir;

    @ManyToOne
    @JsonIgnore
    private ServiceEntity service;
}
