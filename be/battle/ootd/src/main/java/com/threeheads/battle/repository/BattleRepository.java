package com.threeheads.battle.repository;

import com.threeheads.battle.common.enums.BattleStatus;
import com.threeheads.battle.entity.Battle;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface BattleRepository extends JpaRepository<Battle, Long> {

    // 특정 사용자가 신청자(requester) 또는 수신자(responder)로 참여한 배틀을 모두 조회
    @Query("SELECT b FROM Battle b WHERE b.requesterId = :userId OR b.responderId = :userId")
    List<Battle> findByRequesterIdOrResponderId(@Param("userId") Long userId);

    // ACTIVE 상태인 배틀 목록을 생성 시간 기준 내림차순으로 조회
    List<Battle> findByStatusOrderByCreatedAtDesc(BattleStatus status);

    // 투표수 합계를 기준으로 내림차순 정렬
    @Query("SELECT b FROM Battle b WHERE b.status = :status ORDER BY (b.requesterVotes + b.responderVotes) DESC")
    List<Battle> findByStatusOrderByTotalVotesDesc(@Param("status") BattleStatus status);

    // COMPLETE 상태인 배틀 목록을 완료 시간 기준 내림차순으로 조회
    List<Battle> findByStatusOrderByExpiresAtDesc(BattleStatus status);

    // 상태가 CANCELED 또는 EXPIRED인 배틀을 찾는 메서드
    List<Battle> findAllByStatusInAndExpiresAtBefore(List<BattleStatus> statuses, LocalDateTime now);

    // 상태가 ACTIVE이고, 만료 시간이 현재 시간보다 이전인 배틀을 찾는 메서드
    List<Battle> findAllByStatusAndExpiresAtBefore(BattleStatus status, LocalDateTime expiresAt);
}