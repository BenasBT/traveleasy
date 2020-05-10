package com.traveleasy.traveleasybackend.repositories;

import com.traveleasy.traveleasybackend.models.entities.CategoryEntity;
import com.traveleasy.traveleasybackend.models.entities.MarkedSericeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MarkedRepository extends JpaRepository<MarkedSericeEntity,Long> {

    @Query(value = "select * from marked where user_id = :id"  ,nativeQuery = true)
    List<MarkedSericeEntity> findAllByUser(@Param("id") Long id);

    @Query(value = "select * from marked where user_id = :user_id and service_id = :service_id",nativeQuery = true)
    Optional<MarkedSericeEntity> findAllByUserAndService(@Param("user_id") Long user_id,
                                                         @Param("service_id") Long service_id);
}
