package com.threeheads.user.dto.users.reqeust;

import lombok.Data;

@Data
public class UserListResponseDto {
    String nickname;

    public UserListResponseDto(String nickname) {
        this.nickname = nickname;
    }
}
