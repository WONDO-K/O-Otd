package com.threeheads.battle.dto.response;

import com.threeheads.battle.common.enums.BattleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BattleResponseRequestDto {
    private Long userId;  // 응답자의 ID
    private BattleStatus status;  // ACTIVE 또는 CANCELED
    private String responderName; // 수락 시 수신자의 닉네임 (거절 시에는 null 가능)
    private String responderImage; // 수락 시 수신자의 이미지 URL (거절 시에는 null 가능)
}