package com.threeheads.battle.repository;

import com.threeheads.battle.common.enums.BattleStatus;
import com.threeheads.battle.entity.Battle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BattleRepository extends JpaRepository<Battle, Long> {

    // 특정 사용자가 신청자(requester) 또는 수신자(responder)로 참여한 배틀을 모두 조회
    List<Battle> findByRequesterIdOrResponderId(Long userId);

    // ACTIVE 상태인 배틀 목록을 생성 시간 기준 내림차순으로 조회
    List<Battle> findByStatusOrderByCreatedAtDesc(BattleStatus status);

    // ACTIVE 상태인 배틀 목록을 투표 수 기준 내림차순으로 조회
    List<Battle> findByStatusOrderByRequesterVotesDescResponderVotesDesc(BattleStatus status);

    // COMPLETE 상태인 배틀 목록을 완료 시간 기준 내림차순으로 조회
    // 여기서 'completedAt' 필드는 Battle 엔티티에 있어야 합니다.
    List<Battle> findByStatusOrderByCompletedAtDesc(BattleStatus status);

    // 상태가 CANCELED 또는 EXPIRED인 배틀을 찾는 메서드
    List<Battle> findAllByStatusInAndExpiresAtBefore(List<BattleStatus> statuses, LocalDateTime now);

    // 상태가 ACTIVE이고, 만료 시간이 현재 시간보다 이전인 배틀을 찾는 메서드
    List<Battle> findAllByStatusAndExpiresAtBefore(BattleStatus status, LocalDateTime expiresAt);
}