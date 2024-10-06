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
        // 1. 닉네임이 정확히 일치하는 닉네임 검색
        Optional<String> exactMatch = userRepository.findNicknameByExactMatch(nickname);

        // 2. 닉네임이 입력된 문자열로 시작하는 유사한 사용자 목록
        List<UserListResponseDto> similarMatches = userRepository.findNicknamesByStartingWith(nickname)
                .stream()
                .filter(nick -> !nick.equals(nickname)) // 정확히 일치하는 닉네임을 제외
                .map(UserListResponseDto::new)
                .collect(Collectors.toList());

        // 3. 정확히 일치하는 닉네임이 있으면 추가하고, 없으면 빈 리스트
        // 정확히 일치하는 닉네임을 리스트의 맨 앞에 추가
        exactMatch.ifPresent(s -> similarMatches.add(0, new UserListResponseDto(s)));

        // 4. 최대 5개까지만 결과 반환
        return similarMatches.stream()
                .limit(5) // 최대 5개까지만 반환
                .collect(Collectors.toList());
    }
}
