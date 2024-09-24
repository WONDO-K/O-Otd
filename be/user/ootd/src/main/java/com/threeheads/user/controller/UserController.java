package com.threeheads.user.controller;

import com.threeheads.user.entity.User;
import com.threeheads.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequiredArgsConstructor
@RequestMapping("/user")
@Tag(name = "UserController", description = "유저 관련 API")
public class UserController {

    private final UserService userService;
    private final Logger log = LoggerFactory.getLogger(getClass());


    // Feign 요청 관련

    @GetMapping("/findByEmail") // 경로 수정
    @Operation(summary = "이메일로 사용자 찾기", description = "주어진 이메일로 사용자를 조회합니다.")
    public Optional<User> findByEmail(@RequestParam String email){
        log.info("이메일로 유저 정보 조회 : {}", email);
        return Optional.ofNullable(userService.findByEmail(email));
    }

    @PostMapping("/register")
    @Operation(summary = "회원가입 유저 정보 저장", description = "유저 정보를 전달 받아 회원가입처리")
    public void registerUser(@RequestBody User user){
            userService.registerUser(user);
    }


}
