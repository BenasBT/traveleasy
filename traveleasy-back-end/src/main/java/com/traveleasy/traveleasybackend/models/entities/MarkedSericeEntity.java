package com.traveleasy.traveleasybackend.models.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "marked")
public class MarkedSericeEntity extends AbstractEntity{

    @OneToOne(targetEntity=UserEntity.class,cascade= CascadeType.REFRESH)
    private UserEntity user;

    @OneToOne(targetEntity=ServiceEntity.class,cascade=CascadeType.REFRESH)
    private ServiceEntity service;

}
