package com.traveleasy.traveleasybackend.repositories;

import com.traveleasy.traveleasybackend.models.PriceTypes;
import com.traveleasy.traveleasybackend.models.entities.PriceTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PriceTypeRepository extends JpaRepository<PriceTypeEntity,Long> {

        Optional<PriceTypeEntity> findByName(PriceTypes priceTypes);
}
