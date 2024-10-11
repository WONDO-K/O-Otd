package com.threeheads.battle.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BattleDetailResponseDto {
    private Long battleId; // 배틀의 ID
    private Long requesterId; // 배틀 신청자의 사용자 ID
    private Long responderId; // 배틀 수락자의 사용자 ID (수락 전에는 null)
    private String requesterImageUrl; // 신청자의 이미지 URL
    private String responderImageUrl; // 수락자의 이미지 URL (수락 전에는 null)
    private String status; // 배틀 상태 (ACTIVE, COMPLETED, EXPIRED, CANCELED, PENDING)
    private LocalDateTime createdAt; // 배틀 생성 시간
    private LocalDateTime expiresAt;
    private LocalDateTime activeAt;
}
