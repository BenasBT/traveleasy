package com.traveleasy.traveleasybackend.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.traveleasy.traveleasybackend.models.RoleName;
import com.traveleasy.traveleasybackend.models.entities.AbstractEntity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.NaturalId;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "category")
public class CategoryEntity extends AbstractEntity {

    @Column(name = "name", unique = true, nullable = false, updatable = false)
    private String name;

    private boolean valid;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY,cascade=CascadeType.REFRESH)
    @JoinTable(name = "service_category",
            joinColumns = @JoinColumn(name = "category_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id"))
    private  Set<ServiceEntity> service_category = new HashSet<>();

    public CategoryEntity(){}

    public CategoryEntity(long id,String name){
        this.setId(id);
        this.name = name;
    }

}