package com.traveleasy.traveleasybackend.repositories;

import com.traveleasy.traveleasybackend.models.entities.CategoryEntity;
import com.traveleasy.traveleasybackend.models.entities.ServiceEntity;
import com.traveleasy.traveleasybackend.models.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServiceRepository extends JpaRepository<ServiceEntity,Long> {

     List<ServiceEntity> findAllByUser(UserEntity userEntity);

     @Query(value = "select * from service where valid = true"  ,nativeQuery = true)
     List<ServiceEntity> findAllByService_category();

}
