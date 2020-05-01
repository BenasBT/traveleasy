package com.traveleasy.traveleasybackend.repositories;

import com.traveleasy.traveleasybackend.models.entities.ServiceEntity;
import com.traveleasy.traveleasybackend.models.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<ServiceEntity,Long> {

     List<ServiceEntity> findAllByUser(UserEntity userEntity);
}
