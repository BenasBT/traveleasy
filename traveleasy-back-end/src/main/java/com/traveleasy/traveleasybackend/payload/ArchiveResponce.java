package com.traveleasy.traveleasybackend.payload;

import com.traveleasy.traveleasybackend.models.entities.ArchiveEntity;
import lombok.Data;

import java.util.List;

@Data
public class ArchiveResponce {

    Long id;
    Double Price;

    List<ArchiveEntity> archiveEntities;
}
