package com.traveleasy.traveleasybackend.payload;

import com.traveleasy.traveleasybackend.models.entities.CategoryEntity;
import lombok.Data;

import java.sql.Time;
import java.util.Date;
import java.util.List;


@Data
public class AddServiceRequest {

    private String name;

    private String description;

    private double price;

    private List<CategoryEntity> categoryEntities;

    private boolean newCategoryChecked;
    private String newCategory;

    private Time start_time;

    private Time end_time;

    private Date start_date;

    private Date end_date;

    private int min_people_count;

    private int max_people_count;

}
