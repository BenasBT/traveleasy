package com.traveleasy.traveleasybackend.models.entities;

import com.traveleasy.traveleasybackend.models.RoleName;
import com.traveleasy.traveleasybackend.models.entities.AbstractEntity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.NaturalId;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "category")
public class CategoryEntity extends AbstractEntity {

    @Column(name = "name", unique = true, nullable = false, updatable = false)
    private String name;

    private boolean valid;

    public CategoryEntity(){}

    public CategoryEntity(long id,String name){
        this.setId(id);
        this.name = name;
    }

}