package com.threeheads.user.service;


import com.threeheads.user.dto.login.reqeust.SignupRequestDto;
import com.threeheads.user.dto.users.reqeust.UserListResponseDto;
import com.threeheads.user.dto.users.reqeust.UserUpdateRequestDto;
import com.threeheads.user.dto.users.response.UserResponseDto;
import com.threeheads.user.entity.User;

import java.util.List;

public interface UserService {

    UserResponseDto getMyInfo();

    User  setMyInfo(User user, SignupRequestDto signupRequestDto);

    void updateNickname(Long userId, String newNickname);

    boolean existsByNickname(String nickname);

    boolean existsByPhone(String phone);

    List<UserListResponseDto> searchUsersByNicknameWithPriority(String nickname);}
