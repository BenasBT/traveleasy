package com.traveleasy.traveleasybackend.repositories;

import com.traveleasy.traveleasybackend.models.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<PurchaseEntity,Long> {

    List<PurchaseEntity> findAllByUser(UserEntity userEntity);
    List<PurchaseEntity> findAllByProvider(UserEntity userEntity);

    List<PurchaseEntity> findAllByPurchase(Long id);

    List<PurchaseEntity> findAllByService(ServiceEntity serviceEntity);
}
