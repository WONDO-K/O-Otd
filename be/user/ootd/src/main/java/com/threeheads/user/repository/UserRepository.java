package com.threeheads.user.repository;

import com.threeheads.user.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
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

    // 닉네임이 정확히 일치하는 닉네임 검색 (단일 결과)
    @Query("SELECT u.nickname FROM User u WHERE u.nickname = :nickname")
    Optional<String> findNicknameByExactMatch(@Param("nickname") String nickname);

    // 닉네임이 입력된 문자열로 시작하는 사용자 검색
    @Query("SELECT u.nickname FROM User u WHERE u.nickname LIKE :nicknamePrefix%")
    List<String> findNicknamesByStartingWith(@Param("nicknamePrefix") String nicknamePrefix);
}
