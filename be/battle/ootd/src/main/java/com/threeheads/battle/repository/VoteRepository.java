package com.threeheads.battle.repository;

import com.threeheads.battle.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByBattleIdAndUserId(Long battleId, Long userId);
    Vote findByBattleIdAndUserId(Long battleId, Long userId);
}
