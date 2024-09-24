package com.threeheads.library.dto.auth.login.reqeust;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequestDto {
    private String realname;
    private String phone;
    private String attributeKey;
}