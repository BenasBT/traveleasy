package com.traveleasy.traveleasybackend.payload;

import com.traveleasy.traveleasybackend.models.entities.ArchiveEntity;
import com.traveleasy.traveleasybackend.models.entities.PurchaseEntity;
import lombok.Data;

import java.util.List;

@Data
public class PurchaseResponse {

    Long id;
    Double Price;

    List<PurchaseEntity> events;
}
