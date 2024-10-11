package com.threeheads.battle.common.enums;

public enum BattleStatus {
    ACTIVE,      // 배틀이 활성 상태
    COMPLETED,   // 배틀이 완료됨 (투표 종료 등)
    EXPIRED,     // 24시간 만료로 인해 배틀이 만료됨
    CANCELED,     // 배틀이 거부되거나 취소됨
    PENDING      // 배틀이 대기 중
}
