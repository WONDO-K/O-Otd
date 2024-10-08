package com.threeheads.battle.controller;

import com.threeheads.battle.dto.BattleDto;
import com.threeheads.battle.dto.reqeust.BattleRequestDto;
import com.threeheads.battle.dto.response.BattleDetailResponseDto;
import com.threeheads.battle.dto.response.BattleResponseDto;
import com.threeheads.battle.dto.response.BattleResponseRequestDto;
import com.threeheads.battle.dto.response.VoteRequestDto;
import com.threeheads.battle.service.BattleService;
import com.threeheads.library.exception.CustomException;
import com.threeheads.library.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
//@RequestMapping("/battles")
@Tag(name = "BattleController", description = "배틀 관련 API")
public class BattleController {

    private final BattleService battleService;
    private Logger log = LoggerFactory.getLogger(getClass());

    @GetMapping("/{battleId}")
    @Operation(summary = "배틀 상세 조회", description = "배틀 상세 정보를 조회합니다.")
    public ResponseEntity<BattleDetailResponseDto> getBattle(@PathVariable Long battleId) {
        BattleDetailResponseDto battleDetailResponseDto = battleService.getBattleById(battleId);
        return ResponseEntity.ok(battleDetailResponseDto);
    }

    @PostMapping("/vote/{battleId}")
    @Operation(summary = "배틀 투표", description = "배틀에 투표합니다.")
    public ResponseEntity<?> voteBattle(@PathVariable Long battleId, @RequestBody VoteRequestDto voteRequestDto) {
        log.info("투표 요청: battleId={}, voteRequestDto={}", battleId, voteRequestDto);

        try {
            battleService.voteBattle(battleId, voteRequestDto);
            return ResponseEntity.ok().body("투표가 완료되었습니다.");
        } catch (CustomException ex) {
            // ErrorCode를 통해 상태 코드와 메시지를 가져옴

            ErrorCode errorCode = ex.getErrorCode();
            return ResponseEntity.status(errorCode.getStatus()).body(errorCode.getMessage());
        }
    }

    // 배틀 신청 API
    @PostMapping("/create")
    @Operation(summary = "배틀 신청", description = "배틀을 신청합니다.")
    public ResponseEntity<BattleDto> createBattle(@RequestBody BattleRequestDto request) {
        BattleDto createdBattle = battleService.createBattle(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBattle);
    }

    // 배틀 응답 API (수락 또는 거절)
    @PostMapping("/response/{battleId}")
    @Operation(summary = "배틀 응답", description = "배틀을 수락하거나 거절합니다.")
    public ResponseEntity<BattleResponseDto> respondToBattle(
            @PathVariable Long battleId,
            @RequestBody BattleResponseRequestDto responseDto) {

        BattleResponseDto response = battleService.handleBattleResponse(responseDto, battleId);
        return ResponseEntity.ok(response);
    }

    /**
     * 1. ACTIVE 상태인 배틀 리스트 최신순 조회
     */
    @GetMapping("/list/active/recent/{userId}")
    @Operation(summary = "ACTIVE 배틀 리스트 최신순 조회", description = "ACTIVE 상태인 배틀을 생성 시간 기준 최신순으로 조회합니다.")
    public ResponseEntity<List<BattleDto>> getActiveBattlesByRecent(@PathVariable Long userId) {
        List<BattleDto> battles = battleService.getActiveBattlesByRecent(userId);
        return ResponseEntity.ok(battles);
    }

    /**
     * 2. ACTIVE 상태인 배틀 리스트 투표순 조회
     */
    @GetMapping("/list/active/popular/{userId}")
    @Operation(summary = "ACTIVE 배틀 리스트 투표순 조회", description = "ACTIVE 상태인 배틀을 투표 수 기준 내림차순으로 조회합니다.")
    public ResponseEntity<List<BattleDto>> getActiveBattlesByVote(@PathVariable Long userId) {
        List<BattleDto> battles = battleService.getActiveBattlesByVote(userId);
        return ResponseEntity.ok(battles);
    }

    /**
     * 3. COMPLETE 상태인 배틀 리스트 완료순 조회
     */
    @GetMapping("/list/completed/recent/{userId}")
    @Operation(summary = "COMPLETE 배틀 리스트 완료순 조회", description = "COMPLETE 상태인 배틀을 완료 시간 기준 내림차순으로 조회합니다.")
    public ResponseEntity<List<BattleDto>> getCompletedBattlesByCompletionTime(@PathVariable Long userId) {
        List<BattleDto> battles = battleService.getCompletedBattlesByCompletionTime(userId);
        return ResponseEntity.ok(battles);
    }

    @GetMapping("/list/completed/popular/{userId}")
    @Operation(summary = "COMPLETE 배틀 리스트 투표순 조회", description = "COMPLETE 상태인 배틀을 투표 수 기준 내림차순으로 조회합니다.")
    public ResponseEntity<List<BattleDto>> getCompletedBattlesByVote(@PathVariable Long userId) {
        List<BattleDto> battles = battleService.getCompletedBattlesByVote(userId);
        return ResponseEntity.ok(battles);
    }

    // 특정 사용자의 배틀 리스트 조회 API
    @GetMapping("/list/{userId}")
    @Operation(summary = "특정 사용자의 배틀 리스트 조회", description = "특정 사용자의 배틀 리스트를 조회합니다.")
    public ResponseEntity<List<BattleDto>> getUserBattles(@PathVariable Long userId) {
        List<BattleDto> userBattles = battleService.getUserBattles(userId);
        return ResponseEntity.ok(userBattles);
    }
}