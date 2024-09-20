package com.threeheads.library.dto.user;

import com.threeheads.library.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserDto {

    private Long id; // 유저 pk
    private String username; // 유저 아이디
    private String nickname; // 유저 닉네임
    private String email;
    private String phone;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String socialType;
    private String attributeKey;

    // 엔티티 클래스를 DTO로 변환하는 편리한 생성자
    public UserDto(com.threeheads.library.entity.User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.nickname = user.getNickname();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.role = user.getRole();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
        this.socialType = user.getSocialType();
        this.attributeKey = user.getAttributeKey();
    }

}