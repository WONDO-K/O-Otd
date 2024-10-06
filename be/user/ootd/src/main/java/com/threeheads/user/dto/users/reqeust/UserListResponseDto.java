package com.threeheads.user.dto.users.reqeust;

import lombok.Data;

@Data
public class UserListResponseDto {
    Long id;
    String nickname;

    public UserListResponseDto(Long id, String nickname) {
        this.id = id;
        this.nickname = nickname;
    }
}
