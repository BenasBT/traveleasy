package com.traveleasy.traveleasybackend.payload;

import com.traveleasy.traveleasybackend.models.PriceTypes;
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
    private PriceTypes price_type;

    private List<CategoryEntity> categoryEntities;

    private boolean newCategoryChecked;
    private String newCategory;

    private String start_time;

    private String end_time;

    private String start_date;

    private String end_date;

    private int min_people_count;

    private int max_people_count;

}
