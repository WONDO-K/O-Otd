package com.threeheads.library.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // 유저 관련
    USER_NOT_FOUND(404, "U001", "회원정보를 찾을 수 없습니다."),
    DUPLICATE_EMAIL(400, "U002", "이미 존재하는 이메일 입니다."),
    DUPLICATE_NICKNAME(400, "U003", "이미 존재하는 별명입니다."),
    DUPLICATE_ID(400, "U004", "이미 존재하는 아이디입니다."),
    INVALID_PARAMETER(400, "U005", "잘못된 요청입니다."),
    POST_NOT_FOUND(404, "U006", "게시글이 존재하지 않습니다."),
    PHONE_DUPLICATION(400, "U007", "이미 존재하는 전화번호입니다."),
    USER_REGISTRATION_FAILED(400, "U008", "회원 가입 중에 오류가 발생했습니다."),

    // 카카오 로그인 관련 에러 코드
    KAKAO_TOKEN_PARSING_FAILED(500, "K001", "카카오 액세스 토큰 또는 사용자 정보 파싱 실패"),
    KAKAO_TOKEN_REQUEST_FAILED(500, "K002", "카카오 액세스 토큰 요청 실패"),
    KAKAO_USER_INFO_REQUEST_FAILED(500, "K003", "카카오 사용자 정보 요청 실패"),
    KAKAO_USER_INFO_NOT_FOUND(400, "K004", "카카오 사용자 정보를 가져오는 데 실패했습니다."),
    KAKAO_USER_INFO_PARSING_FAILED(500, "K005", "카카오 사용자 정보 파싱 실패"),
    LOGIN_OR_REGISTER_FAILED(500, "K006", "회원가입 또는 로그인 처리 중 오류 발생"),

    // 리프레시 토큰 관련 에러 코드
    REDIS_REFRESH_TOKEN_NOT_FOUND(404, "R001", "해당 액세스 토큰에 대한 리프레시 토큰을 찾을 수 없습니다."),
    REDIS_TOKEN_CREATE_FAILED(500, "R002", "Redis에 토큰 생성 중 오류 발생"),
    REFRESH_TOKEN_EXPIRED(401, "R003", "리프레시 토큰이 만료되었습니다."),
    INVALID_REFRESH_TOKEN(400, "R004", "잘못된 리프레시 토큰입니다."),

    // 인증 권한 관련 에러 코드
    USER_NOT_AUTHORIZED(403, "A001", "사용자가 권한이 없습니다."),


    // 일반적인 에러 코드
    INTERNAL_SERVER_ERROR(500, "S001", "서버 내부 오류가 발생했습니다."),
    BAD_REQUEST(400, "S002", "잘못된 요청입니다."),
    FORBIDDEN(403, "S003", "액세스가 거부되었습니다."),
    NOT_FOUND(404, "S004", "리소스를 찾을 수 없습니다."),

    // 로그아웃 관련 에러 코드
    LOGOUT_FAILED(500, "L001", "로그아웃 실패"),

    // 배틀 관련 에러 코드
    BATTLE_NOT_FOUND(404, "B001", "배틀을 찾을 수 없습니다."),
    BATTLE_ALREADY_COMPLETED(400, "B002", "이미 완료된 배틀입니다."),
    BATTLE_NOT_ACTIVE(400, "B003", "배틀이 활성 상태가 아니거나 종료되었습니다."),
    DUPLICATE_VOTE(409, "B004", "이미 해당 배틀에 투표하셨습니다."),
    INVALID_BATTLE_RESPONSE(400, "B005", "잘못된 배틀 응답입니다."),
    BATTLE_RESPONSE_NOT_ALLOWED(403, "B006", "해당 배틀에 응답할 권한이 없습니다."),
    BATTLE_CREATION_FAILED(500, "B007", "배틀 생성 중 오류가 발생했습니다."),
    BATTLE_VOTE_FAILED(500, "B008", "배틀 투표 중 오류가 발생했습니다.");

    private final int status;
    private final String code;
    private final String message;
}