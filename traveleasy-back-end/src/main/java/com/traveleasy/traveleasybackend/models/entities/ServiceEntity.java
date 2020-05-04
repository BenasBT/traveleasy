package com.traveleasy.traveleasybackend.models.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Time;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "service")
public class ServiceEntity extends AbstractEntity {

    @OneToOne(targetEntity=UserEntity.class,cascade=CascadeType.ALL)
    private UserEntity user;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private double price;

    @Column(name = "start_time", columnDefinition="TIME")
    private Time start_time;

    @Column(name = "end_time", columnDefinition="TIME")
    private Time end_time;

    @JsonFormat(pattern="yyyy-MM-dd")
    @Column(name = "start_date", columnDefinition="DATE")
    private Date start_date;

    @JsonFormat(pattern="yyyy-MM-dd")
    @Column(name = "end_date", columnDefinition="DATE")
    private Date end_date;

    @Column(name = "min_people_count")
    private int min_people_count;

    @Column(name = "max_people_count")
    private int max_people_count;

    @ManyToMany(fetch = FetchType.LAZY,cascade=CascadeType.ALL)
    @JoinTable(name = "service_category",
            joinColumns = @JoinColumn(name = "service_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<CategoryEntity> service_category = new HashSet<>();

    @OneToMany(cascade=CascadeType.ALL)
    @JoinColumn(name="service_id")
    private Set<PhotoEntity> service_photo = new HashSet<>();

}
