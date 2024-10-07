package com.threeheads.user.repository;

import com.threeheads.user.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByPhone(String phone);

    boolean existsByNickname(String nickname);

    boolean existsByPhone(String phone);

    @Query("SELECT u.id as id, u.nickname as nickname FROM User u WHERE u.nickname = :nickname")
    Optional<Tuple> findUserByExactMatch(@Param("nickname") String nickname);

    @Query("SELECT u.id as id, u.nickname as nickname FROM User u WHERE u.nickname LIKE CONCAT(:nicknamePrefix, '%')")
    List<Tuple> findUsersByStartingWith(@Param("nicknamePrefix") String nicknamePrefix);

}
