package com.traveleasy.traveleasybackend.models.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Time;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "event")
public class EventEntity extends AbstractEntity {

    public EventEntity(){}

    @ManyToOne(targetEntity=UserEntity.class,cascade=CascadeType.REFRESH)
    private UserEntity user;

    @ManyToOne(targetEntity=UserEntity.class,cascade=CascadeType.REFRESH)
    private UserEntity provider;

    @ManyToOne(targetEntity=ServiceEntity.class,cascade=CascadeType.REFRESH)
    private ServiceEntity service;

    @Column(name = "fixed_date")
    private boolean fixed_date;

    @JsonFormat(pattern="HH:mm")
    @Column(name = "start_time", columnDefinition="TIME")
    private Time start_time;

    @JsonFormat(pattern="HH:mm")
    @Column(name = "end_time", columnDefinition="TIME")
    private Time end_time;

    @JsonFormat(pattern="yyyy-MM-dd")
    @Column(name = "start_date", columnDefinition="DATE")
    private Date start_date;

    @JsonFormat(pattern="yyyy-MM-dd")
    @Column(name = "end_date", columnDefinition="DATE")
    private Date end_date;

    @Column(name = "people_count")
    private int people_count;

    @Column(name = "price_counter")
    private double price_counter;

    @Column(name = "price")
    private double price;


//{service={id=1,
//        user={id=1,
//                name=Benas Budnikas,
//                email=budnikasb@gmail.com,
//                emailVerified=false,
//                password=null,
//                roleEntities=[{id=2, name=ROLE_PROVIDER},
//                {id=1, name=ROLE_USER}],
//                 provider=google, providerId=104073689672820796040,
//                 imageUrl=https://lh3.googleusercontent.com/a-/AOh14GhPUr4Z5NHMUXvlbLsdFfC3bebHhA2S56aOgfdOGg},
//    name=1,
//    description=1,
//    price=1,
//    start_time=07:30:00,
//    end_time=17:30:00,
//    start_date=2020-05-19,
//    end_date=2020-05-19,
//    min_people_count=111,
//    max_people_count=111,
//    status=PENDING,
//    service_category=[{id=8, name=Rent, valid=true}, {id=7, name=Activities, valid=true}, {id=5, name=Transportation Of People, valid=true},
//        {id=4, name=Delivery, valid=true}],
//    service_photo=[{id=1, name=Dark_Ivy.jpg, dir=/home/anthon/Projects/traveleasy/ftp/1/Dark_Ivy.jpg}]},
//    fixed_date=false,
//    start_date=2020-05-20,
//    start_time=07:30,
//    end_date=2020-05-30,
//    end_time=17:30,
//    people_count=1}



}
