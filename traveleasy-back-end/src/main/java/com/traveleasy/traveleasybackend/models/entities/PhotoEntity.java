package com.traveleasy.traveleasybackend.models.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "photos")
public class PhotoEntity extends AbstractEntity {

    @Column(name = "name")
    private String name;

    @Column(name = "dir")
    private String dir;
}
