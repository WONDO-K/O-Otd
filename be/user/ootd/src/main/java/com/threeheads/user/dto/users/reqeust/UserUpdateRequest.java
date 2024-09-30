package com.threeheads.user.dto.users.reqeust;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class UserUpdateRequest {

    private String nickName;
    private String phone;
}
