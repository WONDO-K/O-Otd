package com.threeheads.user.controller;

import com.threeheads.library.dto.user.UpdateNicknameRequestDto;
import com.threeheads.user.common.JwtTokenProvider;
import com.threeheads.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user-service")
@Tag(name = "UserController", description = "유저 관련 API")
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final Logger log = LoggerFactory.getLogger(getClass());

    @PutMapping("/update/nickname")
    public ResponseEntity<?> updateNickname(@RequestHeader("Authorization") String token,
                                            @RequestBody UpdateNicknameRequestDto request){
        // JWT 토큰에서 사용자 이름 추출
        String userEmail = jwtTokenProvider.getClaimsFromToken(token.replace("Bearer ", "")).getSubject();  // JWT 토큰의 subject에서 username 추출
        log.info("새로운 닉네임 : {}", request.getNewNickname());
        log.info("토큰에서 추출한 이메일 : {}", userEmail);

        // 닉네임 업데이트
        userService.updateNickname(userEmail,request.getNewNickname());
        log.info("닉네임 변경 완료");

        return ResponseEntity.ok("닉네임 변경 성공");
    }

}
