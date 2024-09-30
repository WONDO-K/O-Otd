package com.threeheads.battle.dto.response;

import lombok.Data;

@Data
public class VoteRequestDto {
    private Long voterId;     // 투표자 ID
    private Long votedForId;  // 투표 대상자 ID (requester 또는 responder)
}
