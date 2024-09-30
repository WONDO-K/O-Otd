package com.threeheads.battle.repository;

import com.threeheads.battle.common.enums.BattleStatus;
import com.threeheads.battle.entity.Battle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BattleRepository extends JpaRepository<Battle, Long> {

    // 특정 사용자가 신청자(requester) 또는 수신자(responder)로 참여한 배틀을 모두 조회
    List<Battle> findByRequesterIdOrResponderId(Long userId);

    // 최신 배틀 목록 조회 (생성 시간 기준 내림차순)
    List<Battle> findAllByOrderByCreatedAtDesc();

    // 투표 수가 많은 배틀 목록 조회 (투표 수 합계 기준 내림차순)
    List<Battle> findAllByOrderByRequesterVotesDescResponderVotesDesc();

    // 상태가 CANCELED 또는 EXPIRED인 배틀을 찾는 메서드
    List<Battle> findAllByStatusInAndExpiresAtBefore(List<BattleStatus> statuses, LocalDateTime now);

    // 상태가 ACTIVE이고, 만료 시간이 현재 시간보다 이전인 배틀을 찾는 메서드
    List<Battle> findAllByStatusAndExpiresAtBefore(BattleStatus status, LocalDateTime expiresAt);

}