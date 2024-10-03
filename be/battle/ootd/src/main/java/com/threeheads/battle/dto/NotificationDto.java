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
    private Long userId; // 알림을 받을 사용자 ID
    private String title; // 알림 제목
    private String message; // 알림 메시지
    private LocalDateTime timestamp; // 알림 발생 시간
    private boolean isRead; // 알림 읽음 여부
}
