package com.threeheads.battle.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BattleDetailResponseDto {
    private Long battleId;
    private Long requesterId;
    private Long responderId;
    private String requesterImageUrl;
    private String responderImageUrl;
    private String status;
}
