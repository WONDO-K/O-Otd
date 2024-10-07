package com.threeheads.user.controller;


import com.threeheads.library.dto.auth.StatusResponseDto;
import com.threeheads.user.common.jwt.GeneratedToken;
import com.threeheads.user.dto.kakao.KakaoUserInfoDto;
import com.threeheads.user.dto.login.reqeust.SignupRequestDto;
import com.threeheads.user.dto.login.response.TokenResponseStatus;
import com.threeheads.user.dto.users.reqeust.UpdateNicknameRequestDto;
import com.threeheads.user.dto.users.reqeust.UserListResponseDto;
import com.threeheads.user.dto.users.reqeust.UserUpdateRequestDto;
import com.threeheads.user.dto.users.response.UserResponseDto;
import com.threeheads.user.entity.User;
import com.threeheads.user.redis.service.TokenBlacklistService;
import com.threeheads.user.service.AuthService;
import com.threeheads.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
//@RequestMapping("/user-service")
@Tag(name = "UserController", description = "유저 및 인증 관련 API")
public class UserController {

    private final AuthService authService;
    private final UserService userService;
    private final TokenBlacklistService tokenBlacklistService;
    private final Logger log = LoggerFactory.getLogger(getClass());

    // 닉네임 존재 여부 확인 API -> 닉네임 중복 검사
    @GetMapping("/check/nickname")
    @Operation(summary = "닉네임 중복 검색", description = "닉네임을 검색하여 일치하는 유저가 있는지 확인합니다.")
    public ResponseEntity<Boolean> existsByNickname(@RequestParam String nickname) {
        boolean isExist = userService.existsByNickname(nickname);
        return ResponseEntity.ok(isExist);
    }

    // 우선순위를 반영한 닉네임 검색 API (최대 5개 반환)
    @GetMapping("/user-list/search")
    @Operation(summary = "닉네임 검색", description = "닉네임을 검색하여 일치하는 유저 목록을 반환합니다.")
    public List<UserListResponseDto> searchUsers(@RequestParam String nickname) {
        return userService.searchUsersByNicknameWithPriority(nickname);
    }

    // 전화번호 중복 여부 확인
    @GetMapping("/check/phone")
    @Operation(summary = "전화번호 중복 검색", description = "전화번호를 검색하여 일치하는 유저가 있는지 확인합니다.")
    public ResponseEntity<Boolean> existsByPhone(@RequestParam String phone) {
        boolean isExist = userService.existsByPhone(phone);
        return ResponseEntity.ok(isExist);
    }

    // 인증이 필요 없는 경로 (로그아웃)
    @PostMapping("/auth/logout")
    @Operation(summary = "로그아웃", description = "로그아웃 처리 및 토큰 삭제")
    public ResponseEntity<StatusResponseDto> logout(HttpServletRequest request) {
        // HTTP 요청에서 액세스 토큰 헤더를 추출
        String accessTokenHeader = request.getHeader("Authorization");

        // 액세스 토큰이 없으면 오류 반환
        if (accessTokenHeader == null || !accessTokenHeader.startsWith("Bearer ")) {
            log.error("로그아웃 요청에 유효한 액세스 토큰이 없습니다.");
            return ResponseEntity.badRequest()
                    .body(StatusResponseDto.addStatus(400, "유효한 액세스 토큰이 없습니다."));
        }
        // 'Bearer ' 접두사 제거
        String accessToken = accessTokenHeader.substring(7);

        // 로그아웃 처리: 액세스 토큰을 블랙리스트에 추가하고, 연관된 리프레시 토큰 삭제
        return authService.logout(accessToken);
    }

    // Gateway에서 토큰 블랙리스트에 있는지 확인
    @GetMapping("/auth/is-blacklisted")
    @Operation(summary = "토큰 블랙리스트 확인", description = "토큰이 블랙리스트에 있는지 확인합니다.")
    public ResponseEntity<Boolean> isTokenBlacklisted(@RequestParam String accessToken) {
        boolean isBlacklisted = tokenBlacklistService.isTokenBlacklisted(accessToken);
        return ResponseEntity.ok(isBlacklisted);
    }

    // 인증이 필요 없는 경로 (토큰 갱신)
    @PostMapping("/auth/refresh")
    @Operation(summary = "토큰 갱신", description = "리프레시 토큰을 이용해 액세스 토큰을 갱신합니다.")
    public ResponseEntity<TokenResponseStatus> refresh(HttpServletRequest request) {

        // Authorization 헤더에서 액세스 토큰 추출
        String accessToken = request.getHeader("Authorization");
        String refreshToken = request.getHeader("refreshToken");

        log.info("전달 받은 accessToken: " + accessToken);
        log.info("전달 받은 refreshToken: " + refreshToken);

        // refreshToken이 없거나 accessToken이 없으면 오류 반환
        if (accessToken == null ||  refreshToken == null ) {
            log.error("Access Token or Refresh Token is missing");
            return ResponseEntity.badRequest().body(new TokenResponseStatus(400, null));
        }
        log.info("토큰 갱신 호출");
        return authService.refresh(accessToken,refreshToken);
    }

    // 인증이 필요한 경로 (내 정보 조회)
    @GetMapping("/myinfo")
    @Operation(summary = "내 정보 조회", description = "현재 로그인된 사용자의 정보를 반환합니다.")
    public ResponseEntity<UserResponseDto> getMyInfo() {
        log.info("내 정보 조회 호출");
        UserResponseDto userDto = userService.getMyInfo();
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/setmyinfo")
    @Operation(summary = "내 정보 초기 설정", description = "초기 가입시 입력한 정보를 반영합니다.")
    public ResponseEntity<User> setMyInfo(@RequestBody SignupRequestDto signupRequestDto) {
        // 로그인된 사용자를 가져옴
        User currentUser = userService.getMyInfo().toEntity();
        log.info("내 정보 초기 설정 호출 : " + currentUser);
        User updatedUser = userService.setMyInfo(currentUser, signupRequestDto);
        return ResponseEntity.ok(updatedUser);
    }
    
    @PostMapping("/update/nickname/{userId}")
    @Operation(summary = "닉네임 수정", description = "닉네임을 수정합니다.")
    public ResponseEntity<?> updateNickname(@PathVariable Long userId, @RequestBody UpdateNicknameRequestDto dto) {
        userService.updateNickname(userId,dto.getNewNickname());
        return ResponseEntity.ok().body("닉네임 변경을 완료했습니다." + dto.getNewNickname());
    }

    // 인증이 필요 없는 경로 (카카오 로그인)
    @GetMapping("/auth/kakao-login")
    @Operation(summary = "카카오 로그인", description = "카카오 인가 코드를 받아 로그인 처리")
    public ResponseEntity<Map<String, String>> kakaoLogin(@RequestParam String code, HttpServletResponse response) {
        try {
            KakaoUserInfoDto kakaoUserInfoDto = authService.requestAccessTokenAndUserInfo(code);

            if (kakaoUserInfoDto == null || kakaoUserInfoDto.getKakaoAccount().getEmail() == null) {
                log.error("카카오 사용자 정보를 가져오는 데 실패했습니다.");
                return ResponseEntity.status(400).body(Map.of("error", "카카오 사용자 정보를 가져오는 데 실패했습니다."));
            }

            // 3. 사용자 등록 또는 로그인 처리 (회원가입 여부와 User 객체를 함께 반환)
            Map<String, Object> loginResult = authService.kakaoRegisterOrLoginUser(kakaoUserInfoDto.getKakaoAccount().getEmail());
            User user = (User) loginResult.get("user");
            boolean existed = (boolean) loginResult.get("existed");

            // 사용자 등록 또는 로그인 처리
            GeneratedToken token = authService.handleKakaoLoginSuccess(user.getEmail(), response);

            // 액세스 토큰을 응답으로 반환
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("accessToken", token.getAccessToken());
            responseBody.put("refreshToken", token.getRefreshToken());
            responseBody.put("existed", String.valueOf(existed));  // 회원가입 여부 추가

            return ResponseEntity.ok(responseBody);

        } catch (Exception e) {
            log.error("카카오 로그인 처리 중 오류 발생", e);
            return ResponseEntity.status(500).body(Map.of("error", "카카오 로그인 처리 중 오류 발생"));
        }
    }

}
