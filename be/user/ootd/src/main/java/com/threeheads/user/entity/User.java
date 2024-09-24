package com.threeheads.user.entity;

import com.threeheads.library.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")  // DB에서는 user_id로, 자바에서는 id로 사용
    private Long id;

    @Column(name = "user_name", length = 30)
    private String username;

    @Column(name = "role", nullable = false)
    @Enumerated(value = EnumType.STRING)
    private Role role;

    @Column(name = "user_email", length = 255)
    private String email;

    @Column(name = "user_phonenumber", length = 20)
    private String phone;

    @Column(name = "create_date", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "delete_date")
    private LocalDateTime deletedAt;

    @Column(name = "nickname", length = 20, nullable = false)
    private String nickname;

    @Column(name = "user_battle", nullable = false, columnDefinition = "int default 0")
    private int userBattle;

    @Column(name = "user_win", nullable = false, columnDefinition = "int default 0")
    private int userWin;

    @Column(name = "social_type", length = 255, nullable = false)
    private String socialType;

    @Column(name = "attribute_key")
    private String attributeKey;

    @Column(name = "user_pw", length = 30, nullable = false)
    private String passwordHash;


    public void changePhone(String phone) {
        this.phone = phone;
    }

    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }
}