package com.threeheads.battle.dto.response;

import com.threeheads.battle.common.enums.BattleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BattleResponseDto {
    private Long battleId;  // 생성된 배틀의 PK
    private Long responderId;  // 수신자의 사용자 ID (배틀 대상자)
    private String responderImage;  // 수신자의 이미지 URL (null일 수 있음)
    private String responderName;  // 수신자 이름 (null일 수 있음)
    private BattleStatus status;  // 배틀 상태 (ACTIVE, COMPLETED, EXPIRED, CANCELED)
    private LocalDateTime createdAt;  // 배틀 생성 시간
    private LocalDateTime expiresAt;  // 배틀 만료 시간 (24시간)
}
