package com.threeheads.battle.service;

import com.threeheads.battle.dto.BattleDto;
import com.threeheads.battle.dto.reqeust.BattleRequestDto;
import com.threeheads.battle.dto.response.BattleDetailResponseDto;
import com.threeheads.battle.dto.response.BattleResponseDto;
import com.threeheads.battle.dto.response.BattleResponseRequestDto;
import com.threeheads.battle.dto.response.VoteRequestDto;

import java.util.List;

public interface BattleService {
    // 특정 배틀을 ID로 조회
    BattleDetailResponseDto getBattleById(Long battleId);

    // 배틀에 투표
    void voteBattle(Long battleId, VoteRequestDto voteRequestDto);

    // 새로운 배틀 생성
    BattleDto createBattle(BattleRequestDto dto);

    // 배틀 응답 처리 (수락 또는 거절)
    BattleResponseDto handleBattleResponse(BattleResponseRequestDto responseDto, Long userId);

    // 1. ACTIVE 상태인 배틀 리스트 최신순 조회
    List<BattleDto> getActiveBattlesByRecent();

    // 2. ACTIVE 상태인 배틀 리스트 투표순 조회
    List<BattleDto> getActiveBattlesByVote();

    // 3. COMPLETE 상태인 배틀 리스트 완료순 조회
    List<BattleDto> getCompletedBattlesByCompletionTime();

    // 특정 사용자의 배틀 리스트 조회 (신청자 또는 수신자)
    List<BattleDto> getUserBattles(Long userId);

}