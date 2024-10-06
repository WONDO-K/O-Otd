package com.threeheads.user.service.impl;

import com.threeheads.library.dto.auth.security.SecurityUserDto;

import com.threeheads.user.dto.login.reqeust.SignupRequestDto;
import com.threeheads.user.dto.users.reqeust.UserListResponseDto;
import com.threeheads.user.dto.users.reqeust.UserUpdateRequestDto;
import com.threeheads.user.entity.User;
import com.threeheads.library.exception.CustomException;
import com.threeheads.library.exception.ErrorCode;
import com.threeheads.user.common.jwt.JwtAuthFilter;
import com.threeheads.user.dto.users.response.UserResponseDto;
import com.threeheads.user.repository.UserRepository;
import com.threeheads.user.service.UserService;
import jakarta.persistence.Tuple;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final Logger log = LoggerFactory.getLogger(getClass());


    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getMyInfo(){

        SecurityUserDto userDto = JwtAuthFilter.getUser();

        User user = userRepository.findById(userDto.getId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        return new UserResponseDto(user);

    }

    @Override
    public User setMyInfo(User user, SignupRequestDto signupRequestDto) {

        User setUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String phoneNumber = signupRequestDto.getPhone();

        if (userRepository.findByPhone(phoneNumber).isPresent()) {

            log.error("이미 존재하는 전화번호입니다.");

            throw new CustomException(ErrorCode.PHONE_DUPLICATION);

        }

        setUser.changePhone(signupRequestDto.getPhone());

        setUser.changeNickname(signupRequestDto.getNickname());

        userRepository.save(setUser);

        log.info("전화번호, 닉네임 수정 완료");
        return setUser;
    }

    @Override
    public void updateUserInfo(String username, UserUpdateRequestDto request) {

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

            user.changePhone(request.getPhone());
            user.changeNickname(request.getNickName());

            userRepository.save(user);

            log.info("전화번호, 닉네임 수정 완료");
    }

    @Override
    public void updateNickname(String userEmail, String newNickname) {

        // 사용자 조회
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 닉네임 변경
        user.setNickname(newNickname);
        userRepository.save(user);
    }

    @Override
    public boolean existsByNickname(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    @Override
    public boolean existsByPhone(String phone) {
        return userRepository.existsByPhone(phone);
    }

    @Override
    public List<UserListResponseDto> searchUsersByNicknameWithPriority(String nickname) {
        Optional<Tuple> exactMatch = userRepository.findUserByExactMatch(nickname);
        List<Tuple> similarMatches = userRepository.findUsersByStartingWith(nickname);

        List<UserListResponseDto> result = similarMatches.stream()
                .filter(user -> !user.get("nickname", String.class).equals(nickname))
                .map(user -> new UserListResponseDto(
                        user.get("id", Long.class),
                        user.get("nickname", String.class)
                ))
                .collect(Collectors.toList());

        exactMatch.ifPresent(user -> result.add(0, new UserListResponseDto(
                user.get("id", Long.class),
                user.get("nickname", String.class)
        )));

        return result.stream()
                .limit(5)
                .collect(Collectors.toList());
    }



}
