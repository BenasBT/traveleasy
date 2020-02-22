package com.traveleasy.traveleasybackend.repositories;



import com.traveleasy.traveleasybackend.models.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);

  @Query(value =
    "SELECT * FROM users WHERE username=:username or email=:email",
    nativeQuery = true)
    Optional<UserEntity> findByUsernameOrEmail(
          @Param("username") String username,
          @Param("email") String email);

  @Query(value =
    "SELECT * FROM users WHERE username=:username LIMIT 1",
    nativeQuery = true)
    Optional<UserEntity> existsByUsername(String username);

  @Query(value =
    "SELECT * FROM users WHERE email=:email LIMIT 1",
    nativeQuery = true)
    Optional<UserEntity> existsByEmail(String email);


}
