package com.traveleasy.traveleasybackend.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.traveleasy.traveleasybackend.models.entities.ServiceEntity;
import com.traveleasy.traveleasybackend.models.entities.UserEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.ManyToOne;
import java.sql.Time;
import java.util.Date;

@Data
public class AddEventEntityRequest {

    private ServiceEntity service;

    private boolean fixed_date;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date start_date;

    private Time start_time;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date end_date;

    private Time end_time;

    @Column(name = "people_count")
    private int people_count;
}
