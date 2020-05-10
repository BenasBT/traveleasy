package com.traveleasy.traveleasybackend.models.entities;

import com.traveleasy.traveleasybackend.models.PriceTypes;
import com.traveleasy.traveleasybackend.models.RoleName;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.NaturalId;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "price_types")
public class PriceTypeEntity extends AbstractEntity {

    @Enumerated(EnumType.STRING)
    @NaturalId
    private PriceTypes name;

}
