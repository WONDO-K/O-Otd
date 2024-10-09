package com.threeheads.battle.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 실시간 알림을 전달하기 위한 DTO 클래스
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long id; // 알림의 고유 ID
    // 알림을 보낸 대상의 PK
    private Long senderId; // 알림을 보낸 사용자 ID
    private String senderNickname; // 알림을 보낸 사용자 닉네임
    private Long userId; // 알림을 받을 사용자 ID
    private Long battleId; // 알림과 연관된 배틀 ID
    private String title; // 알림 제목
    private String message; // 알림 메시지
    private LocalDateTime timestamp; // 알림 발생 시간
    private boolean isRead; // 알림 읽음 여부 -> dto 상에서 read로 변경되어 출력됨
}
