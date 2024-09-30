package com.threeheads.battle.service.impl;

import com.threeheads.battle.common.enums.BattleStatus;
import com.threeheads.battle.dto.BattleDto;
import com.threeheads.battle.dto.BattleMapper;
import com.threeheads.battle.dto.reqeust.BattleRequestDto;
import com.threeheads.battle.dto.response.BattleDetailResponseDto;
import com.threeheads.battle.dto.response.BattleResponseDto;
import com.threeheads.battle.dto.response.BattleResponseRequestDto;
import com.threeheads.battle.dto.response.VoteRequestDto;
import com.threeheads.battle.entity.Battle;
import com.threeheads.battle.entity.Vote;
import com.threeheads.battle.repository.BattleRepository;
import com.threeheads.battle.repository.VoteRepository;
import com.threeheads.battle.service.BattleService;
import com.threeheads.battle.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BattleServiceImpl implements BattleService {

    private final BattleRepository battleRepository;
    private final VoteRepository voteRepository;
    private final BattleMapper battleMapper;  // Mapper 주입
    private final NotificationService notificationService;


    @Override
    public BattleDetailResponseDto getBattleById(Long battleId) {
        Battle battle = battleRepository.findById(battleId)
                .orElseThrow(() -> new RuntimeException("배틀을 찾을 수 없습니다: " + battleId));

        // DTO로 변환
        return BattleDetailResponseDto.builder()
                .battleId(battle.getId())
                .requesterId(battle.getRequesterId())
                .responderId(battle.getResponderId())
                .requesterImageUrl(battle.getRequesterImageUrl())
                .responderImageUrl(battle.getResponderImageUrl())
                .status(battle.getStatus().name())
                .build();
    }

    @Override
    public void voteBattle(Long battleId, VoteRequestDto voteRequestDto) {
        Battle battle = battleRepository.findById(battleId)
                .orElseThrow(() -> new RuntimeException("배틀을 찾을 수 없습니다: " + battleId));

        // 배틀 상태 및 기간 확인
        if (battle.getStatus() != BattleStatus.ACTIVE || battle.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("배틀이 활성 상태가 아니거나 이미 종료되었습니다.");
        }

        // 중복 투표 방지
        boolean hasVoted = voteRepository.existsByBattleIdAndVoterId(battleId, voteRequestDto.getVoterId());
        if (hasVoted) {
            throw new RuntimeException("이미 투표하셨습니다.");
        }

        // 투표 내역 저장
        Vote vote = new Vote();
        vote.setBattleId(battleId);
        vote.setVoterId(voteRequestDto.getVoterId());
        vote.setVotedFor(voteRequestDto.getVotedForId());
        voteRepository.save(vote);
    }

    @Override
    public BattleDto createBattle(BattleRequestDto dto) {
        // 새로운 Battle 객체 생성
        Battle battle = Battle.builder()
                .requesterId(dto.getRequesterId())  // 요청자 ID
                .requesterName(dto.getRequesterName())  // 요청자 이름
                .responderId(dto.getResponderId())  // 응답자 ID
                .responderName(dto.getResponderName())  // 응답자 이름
                .requesterImageUrl(dto.getRequesterImage())  // 요청자 이미지 URL
                .status(BattleStatus.PENDING)  // 초기 상태는 PENDING
                .createdAt(LocalDateTime.now())  // 현재 시간을 생성 시간으로 설정
                .expiresAt(LocalDateTime.now().plusHours(24))  // 24시간 유효 기간 설정
                .build();

        // 배틀 정보 저장
        battleRepository.save(battle);
        // 배틀 수신자에게 알림 전송
        notificationService.sendNotification(battle.getResponderId(), "새로운 배틀 요청이 도착했습니다.");

        // 저장된 배틀 정보를 기반으로 BattleDto 생성 및 반환
        return battleMapper.toDto(battle);
    }

    @Override
    public BattleResponseDto handleBattleResponse(BattleResponseRequestDto responseDto, Long userId) {
        // 배틀을 찾아서 상태 처리
        Battle battle = battleRepository.findById(responseDto.getBattleId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Battle ID"));

        // 배틀 상태가 PENDING인지 확인
        if (battle.getStatus() != BattleStatus.PENDING) {
            throw new IllegalStateException("현재 상태에서는 배틀에 응답할 수 없습니다.");
        }

        // 수신자만 응답할 수 있도록 검증
        if (!battle.getResponderId().equals(userId)) {
            throw new SecurityException("해당 배틀에 응답할 권한이 없습니다.");
        }

        // 상태에 따른 처리
        if (responseDto.getStatus() == BattleStatus.ACTIVE) {
            // 배틀 수락 처리
            battle.setStatus(BattleStatus.ACTIVE); // ACTIVE 상태로 변경
            battle.setResponderName(responseDto.getResponderName());  // 실제로 가져온다면 수신자 이름
            battle.setResponderImageUrl(responseDto.getResponderImage());   // 실제로 가져온다면 수신자 이미지
            battle.setActiveAt(LocalDateTime.now()); // ACTIVE 상태로 변경된 시간 설정
            battle.setExpiresAt(LocalDateTime.now().plusWeeks(1)); // 1주일의 유효기간 설정

            // 배틀 수락 알림
            notificationService.sendNotification(battle.getRequesterId(), "배틀이 수락되었습니다.");
            notificationService.sendNotification(battle.getResponderId(), "배틀이 시작되었습니다!");
        } else if (responseDto.getStatus() == BattleStatus.CANCELED) {
            // 배틀 거절 처리
            battle.setStatus(BattleStatus.CANCELED);
            // 배틀 거절 알림
            notificationService.sendNotification(battle.getRequesterId(), "배틀이 거절되었습니다.");
        } else {
            throw new IllegalArgumentException("잘못된 배틀 상태입니다.");
        }

        // 배틀 정보 저장
        battleRepository.save(battle);

        // 배틀 응답 반환
        return BattleResponseDto.builder()
                .battleId(battle.getId())
                .responderId(battle.getResponderId())
                .responderImage(battle.getResponderImageUrl())
                .responderName(battle.getResponderName())  // 실제로 가져온다면 수신자 이름
                .status(battle.getStatus())
                .createdAt(battle.getCreatedAt())
                .expiresAt(battle.getExpiresAt())
                .build();
    }

    // 최신 배틀 리스트 조회
    public List<BattleDto> getRecentBattles() {
        List<Battle> battles = battleRepository.findAllByOrderByCreatedAtDesc();
        return battles.stream().map(battleMapper::toDto).collect(Collectors.toList());
    }

    // 투표수가 많은 배틀 리스트 조회
    public List<BattleDto> getBattlesByVoteCount() {
        List<Battle> battles = battleRepository.findAllByOrderByRequesterVotesDescResponderVotesDesc();
        return battles.stream().map(battleMapper::toDto).collect(Collectors.toList());
    }

    // 특정 사용자의 배틀 리스트 조회 (신청자 또는 수신자)
    public List<BattleDto> getUserBattles(Long userId) {
        // 하나의 userId로 신청자 또는 수신자로 검색
        List<Battle> battles = battleRepository.findByRequesterIdOrResponderId(userId);
        return battles.stream().map(battleMapper::toDto).collect(Collectors.toList());
    }


}
