package com.threeheads.battle.controller;

import com.threeheads.battle.dto.BattleDto;
import com.threeheads.battle.dto.reqeust.BattleRequestDto;
import com.threeheads.battle.dto.response.BattleDetailResponseDto;
import com.threeheads.battle.dto.response.BattleResponseDto;
import com.threeheads.battle.dto.response.BattleResponseRequestDto;
import com.threeheads.battle.dto.response.VoteRequestDto;
import com.threeheads.battle.service.BattleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/battle")
@Tag(name = "BattleController", description = "배틀 관련 API")
public class BattleController {

    private final BattleService battleService;

    @GetMapping("/{battleId}")
    @Operation(summary = "배틀 상세 조회", description = "배틀 상세 정보를 조회합니다.")
    public ResponseEntity<BattleDetailResponseDto> getBattle(@PathVariable Long battleId) {
        BattleDetailResponseDto battleDetailResponseDto = battleService.getBattleById(battleId);
        return ResponseEntity.ok(battleDetailResponseDto);
    }

    @PostMapping("/{battleId}/vote")
    @Operation(summary = "배틀 투표", description = "배틀에 투표합니다.")
    public ResponseEntity<?> voteBattle(@PathVariable Long battleId, @RequestBody VoteRequestDto voteRequestDto) {
        battleService.voteBattle(battleId, voteRequestDto);
        return ResponseEntity.ok().body("투표가 완료되었습니다.");
    }

    // 배틀 신청 API
    @PostMapping("/create")
    @Operation(summary = "배틀 신청", description = "배틀을 신청합니다.")
    public ResponseEntity<BattleDto> createBattle(@RequestBody BattleRequestDto request) {
        BattleDto createdBattle = battleService.createBattle(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBattle);
    }

    // 배틀 응답 API (수락 또는 거절)
    @PostMapping("/{battleId}/response")
    @Operation(summary = "배틀 응답", description = "배틀을 수락하거나 거절합니다.")
    public ResponseEntity<BattleResponseDto> respondToBattle(
            @RequestBody BattleResponseRequestDto responseDto,
            @RequestParam("userId") Long userId) {

        BattleResponseDto response = battleService.handleBattleResponse(responseDto, userId);
        return ResponseEntity.ok(response);
    }

    // 최신 배틀 리스트 조회 API
    @GetMapping("/recent")
    @Operation(summary = "최신 배틀 리스트 조회", description = "최신 배틀 리스트를 조회합니다.")
    public ResponseEntity<List<BattleDto>> getRecentBattles() {
        List<BattleDto> recentBattles = battleService.getRecentBattles();
        return ResponseEntity.ok(recentBattles);
    }

    // 투표수 많은 배틀 리스트 조회 API
    @GetMapping("/popular")
    @Operation(summary = "투표수가 많은 배틀 리스트 조회", description = "투표수가 많은 배틀 리스트를 조회합니다.")
    public ResponseEntity<List<BattleDto>> getPopularBattles() {
        List<BattleDto> popularBattles = battleService.getBattlesByVoteCount();
        return ResponseEntity.ok(popularBattles);
    }

    // 특정 사용자의 배틀 리스트 조회 API
    @GetMapping("/user/{userId}")
    @Operation(summary = "특정 사용자의 배틀 리스트 조회", description = "특정 사용자의 배틀 리스트를 조회합니다.")
    public ResponseEntity<List<BattleDto>> getUserBattles(@PathVariable Long userId) {
        List<BattleDto> userBattles = battleService.getUserBattles(userId);
        return ResponseEntity.ok(userBattles);
    }
}