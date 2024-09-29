package com.threeheads.battle.dto;

import com.threeheads.battle.common.enums.BattleStatus;
import com.threeheads.battle.entity.Battle;
import org.springframework.stereotype.Component;

@Component
public class BattleMapper {

    public BattleDto toDto(Battle battle) {
        return BattleDto.builder()
                .battleId(battle.getId())
                .requesterId(battle.getRequesterId())
                .requesterName(battle.getRequesterName())
                .requesterImage(battle.getRequesterImageUrl())
                .responderId(battle.getResponderId())
                .responderName(battle.getResponderName())
                .responderImage(battle.getResponderImageUrl())
                .status(battle.getStatus().name())
                .createdAt(battle.getCreatedAt())
                .expiresAt(battle.getExpiresAt())
                .requesterVotes(battle.getRequesterVotes())
                .responderVotes(battle.getResponderVotes())
                .build();
    }

    public Battle fromDto(BattleDto dto) {
        return Battle.builder()
                .id(dto.getBattleId())
                .requesterId(dto.getRequesterId())
                .requesterName(dto.getRequesterName())
                .responderId(dto.getResponderId())
                .responderName(dto.getResponderName())
                .requesterImageUrl(dto.getRequesterImage())
                .responderImageUrl(dto.getResponderImage())
                .status(BattleStatus.valueOf(dto.getStatus()))
                .createdAt(dto.getCreatedAt())
                .expiresAt(dto.getExpiresAt())
                .requesterVotes(dto.getRequesterVotes())
                .responderVotes(dto.getResponderVotes())
                .build();
    }


}
