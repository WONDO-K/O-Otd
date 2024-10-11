package com.threeheads.user.dto.users.response;

import com.threeheads.library.enums.Role;
import com.threeheads.user.entity.User;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class UserResponseDto {

    private Long id;
    private String username;
    private String nickname;
    private String email;
    private String phone;
    private String role;
    private LocalDateTime createdAt;
    private String socialType;
    private String attributeKey;


    public UserResponseDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.nickname = user.getNickname();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.role = user.getRole().name();
        this.createdAt = user.getCreatedAt();
        this.socialType = user.getSocialType();
        this.attributeKey = user.getAttributeKey();

    }

    // toEntity 메서드 추가 -> User 객체를 리턴해줌
    public User toEntity() {
        return User.builder()
                .id(this.id)
                .username(this.username)
                .nickname(this.nickname)
                .email(this.email)
                .phone(this.phone)
                .role(Role.valueOf(this.role)) // 문자열로 된 role을 Enum으로 변환
                .createdAt(this.createdAt)
                .socialType(this.socialType)
                .attributeKey(this.attributeKey)
                .build();
    }

}