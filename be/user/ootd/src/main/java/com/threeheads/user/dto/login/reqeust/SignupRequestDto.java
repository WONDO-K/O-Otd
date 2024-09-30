package com.threeheads.user.dto.login.reqeust;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequestDto {
    private String nickname;
    private String phone;
    private String attributeKey;
}
