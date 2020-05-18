package com.traveleasy.traveleasybackend.models.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.traveleasy.traveleasybackend.models.PriceTypes;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Time;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "archive")
public class ArchiveEntity extends AbstractEntity{

//    archive_id BIGINT NOT NULL,
    @Column(name = "archive_id")
    private Long archive_id;

//    user_id BIGINT NOT NULL REFERENCES users(id),
    @ManyToOne(targetEntity=UserEntity.class,cascade= CascadeType.REFRESH)
    @JsonIgnore
    private UserEntity user;

//    provider_id BIGINT NOT NULL REFERENCES users(id),
    @ManyToOne(targetEntity=UserEntity.class,cascade=CascadeType.REFRESH)
    @JsonIgnore
    private UserEntity provider;

//    service_name varchar(255) NOT NULL,
    @Column(name = "service_name", unique = true, nullable = false)
    private String service_name;

    //    service_description varchar(255),
    @Column(name = "service_description")
    private String service_description;

    //    service_price double,
    @Column(name = "service_price")
    private double service_price;

    //    service_price_type varchar(255) NOT NULL,
    @Enumerated(EnumType.STRING)
    @Column(name = "service_price_type")
    private PriceTypes service_price_type;

    //    event_price_counter double,
    @Column(name = "event_price_counter")
    private double event_price_counter;

    //    event_price double,
    @Column(name = "event_price")
    private double event_price;

    //    full_price double,
    @Column(name = "full_price")
    private double full_price;

    //    event_start_date date,
    @JsonFormat(pattern="yyyy-MM-dd")
    @Column(name = "event_start_date", columnDefinition="DATE")
    private Date event_start_date;

    //    event_start_time time,
    @JsonFormat(pattern="HH:mm")
    @Column(name = "event_start_time", columnDefinition="TIME")
    private Time event_start_time;

    //    event_end_date date,
    @JsonFormat(pattern="yyyy-MM-dd")
    @Column(name = "event_end_date", columnDefinition="DATE")
    private Date event_end_date;

    //    event_end_time time,
    @JsonFormat(pattern="HH:mm")
    @Column(name = "event_end_time", columnDefinition="TIME")
    private Time event_end_time;

    //    event_people_count integer,
    @Column(name = "event_people_count")
    private int event_people_count;

}
