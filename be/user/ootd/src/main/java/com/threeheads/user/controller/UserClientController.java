package com.threeheads.user.controller;

import com.threeheads.library.entity.User;
import com.threeheads.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user-client")
@Tag(name = "UserClientController", description = "유저 클라이언트 관련 API")
public class UserClientController {

    private final UserService userService;
    private final Logger log = LoggerFactory.getLogger(getClass());


    @GetMapping("/findByEmail") // 경로 수정
    @Operation(summary = "이메일로 사용자 찾기", description = "주어진 이메일로 사용자를 조회합니다.")
    public Mono<User> findByEmail(@RequestParam String email){
        log.info("이메일로 유저 정보 조회 : {}", email);
        Mono<User> newUser = userService.findByEmail(email);
        log.info("findByUser : {} ",newUser);
        return newUser;
    }

    @PostMapping("/register")
    @Operation(summary = "회원가입 유저 정보 저장", description = "유저 정보를 전달 받아 회원가입처리")
    public void registerUser(@RequestBody User user){
        userService.registerUser(user);
    }

}