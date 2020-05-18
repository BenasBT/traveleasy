package com.traveleasy.traveleasybackend.models.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Time;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "purchase")
public class PurchaseEntity extends AbstractEntity {

    public PurchaseEntity(){}


    @Column(name = "purchase_id")
    private Long purchase;

//user_id BIGINT NOT NULL REFERENCES users(id),
    @ManyToOne(targetEntity=UserEntity.class,cascade= CascadeType.REFRESH)
    private UserEntity user;

//provider_id BIGINT NOT NULL REFERENCES users(id),
    @ManyToOne(targetEntity=UserEntity.class,cascade=CascadeType.REFRESH)
    private UserEntity provider;

//service_id BIGINT NOT NULL REFERENCES service(id),
    @ManyToOne(targetEntity=ServiceEntity.class,cascade=CascadeType.REFRESH)
    private ServiceEntity service;

//start_time time,
    @JsonFormat(pattern="HH:mm")
    @Column(name = "start_time", columnDefinition="TIME")
    private Time start_time;

//end_time time,
    @JsonFormat(pattern="HH:mm")
    @Column(name = "end_time", columnDefinition="TIME")
    private Time end_time;

//start_date date,
    @JsonFormat(pattern="yyyy-MM-dd")
    @Column(name = "start_date", columnDefinition="DATE")
    private Date start_date;

//end_date date,
    @JsonFormat(pattern="yyyy-MM-dd")
    @Column(name = "end_date", columnDefinition="DATE")
    private Date end_date;

//people_count integer,
    @Column(name = "people_count")
    private int people_count;

//price_counter double,
    @Column(name = "price_counter")
    private double price_counter;

//price double,
    @Column(name = "price")
    private double price;

//full_price double,
    @Column(name = "full_price")
    private double full_price;
}
