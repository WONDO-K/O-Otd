package com.threeheads.battle.repository;

import com.threeheads.battle.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByBattleIdAndVoterId(Long battleId, Long voterId);
}
