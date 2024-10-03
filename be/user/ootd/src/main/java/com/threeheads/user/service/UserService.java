package com.threeheads.user.service;


import com.threeheads.user.dto.login.reqeust.SignupRequestDto;
import com.threeheads.user.dto.users.reqeust.UserUpdateRequestDto;
import com.threeheads.user.dto.users.response.UserResponseDto;
import com.threeheads.user.entity.User;

public interface UserService {

    UserResponseDto getMyInfo();

    User  setMyInfo(User user, SignupRequestDto signupRequestDto);

    void updateUserInfo(String username, UserUpdateRequestDto request);

    void updateNickname(String userEmail, String newNickname);
}
