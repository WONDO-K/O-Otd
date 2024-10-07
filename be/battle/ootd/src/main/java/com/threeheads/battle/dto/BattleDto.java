package com.threeheads.battle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BattleDto {
    private Long battleId;  // 배틀의 ID
    private String title;  // 배틀 제목 (요청에 따라 추가 가능)
    private Long requesterId;  // 배틀 신청자의 사용자 ID
    private String requesterName;  // 신청자의 이름
    private String requesterImage;  // 신청자의 이미지 URL
    private Long responderId;  // 배틀 수락자의 사용자 ID (수락 전에는 null)
    private String responderName;  // 수락자의 이름 (수락 전에는 null)
    private String responderImage;  // 수락자의 이미지 URL (수락 전에는 null)
    private String status;  // 배틀 상태 (ACTIVE, COMPLETED, EXPIRED 등)
    private LocalDateTime createdAt;  // 배틀 생성 시간
    private LocalDateTime expiresAt;  // 배틀 만료 시간 (24시간 후 자동 만료)
    private int requesterVotes;  // 신청자에게 투표한 수
    private int responderVotes;  // 수락자에게 투표한 수
    private Long myPickUserId;  // 내가 투표한 사람 (requester 또는 responder)
}