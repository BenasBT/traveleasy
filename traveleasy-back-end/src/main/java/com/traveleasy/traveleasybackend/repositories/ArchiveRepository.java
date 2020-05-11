package com.traveleasy.traveleasybackend.repositories;

import com.traveleasy.traveleasybackend.models.entities.ArchiveEntity;
import com.traveleasy.traveleasybackend.models.entities.ServiceEntity;
import com.traveleasy.traveleasybackend.models.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArchiveRepository extends JpaRepository<ArchiveEntity,Long> {

    List<ArchiveEntity> findAllByUser(UserEntity userEntity);

}
