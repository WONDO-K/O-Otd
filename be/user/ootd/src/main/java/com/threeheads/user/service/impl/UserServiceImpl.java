package com.threeheads.user.service.impl;

import com.threeheads.library.entity.User;
import com.threeheads.library.exception.CustomException;
import com.threeheads.library.exception.ErrorCode;
import com.threeheads.user.repository.UserRepository;
import com.threeheads.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public Mono<User> findByEmail(String email) {
        return Mono.justOrEmpty(userRepository.findByEmail(email));
    }

    @Override
    public void registerUser(User user) {
        try {
            userRepository.save(user);  // 유저 저장
        } catch (Exception e) {
            // 데이터베이스 저장 중 발생하는 일반적인 예외 처리
            throw new CustomException(ErrorCode.USER_REGISTRATION_FAILED);
        }
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
}
