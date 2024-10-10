package com.threeheads.battle.service.impl;

import com.threeheads.battle.common.enums.BattleStatus;
import com.threeheads.battle.common.quartz.BattleCompletionJob;
import com.threeheads.battle.dto.BattleDto;
import com.threeheads.battle.dto.BattleMapper;
import com.threeheads.battle.dto.NotificationDto;
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
import com.threeheads.library.exception.CustomException;
import com.threeheads.library.exception.ErrorCode;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 배틀 서비스 구현 클래스
 */
@Service
@RequiredArgsConstructor
public class BattleServiceImpl implements BattleService {

    private static final Logger log = LoggerFactory.getLogger(BattleServiceImpl.class);
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");


    private final BattleRepository battleRepository;
    private final VoteRepository voteRepository;
    private final BattleMapper battleMapper;  // Mapper 주입
    private final NotificationService notificationService;
    private final Scheduler scheduler;  // Quartz Scheduler 주입

    /**
     * 배틀 생성 메서드
     * @param dto BattleRequestDto
     * @return BattleDto
     */
    @Override
    public BattleDto createBattle(BattleRequestDto dto) {

        // 요청자와 응답자가 동일한지 검증
        log.info("요청자 ID: {}, 응답자 ID: {}", dto.getRequesterId(), dto.getResponderId());
        if (dto.getRequesterId().equals(dto.getResponderId())) {
            throw new IllegalArgumentException("요청자와 응답자가 같은 경우 배틀을 신청할 수 없습니다.");
        }

        // 새로운 Battle 객체 생성
        Battle battle = Battle.builder()
                .requesterId(dto.getRequesterId())  // 요청자 ID
                .requesterName(dto.getRequesterName())  // 요청자 이름
                .responderId(dto.getResponderId())  // 응답자 ID
                .responderName(dto.getResponderName())  // 응답자 이름
                .requesterImageUrl(dto.getRequesterImage())  // 요청자 이미지 URL
                .status(BattleStatus.PENDING)  // 초기 상태는 PENDING
                .createdAt(LocalDateTime.now())  // 현재 시간을 생성 시간으로 설정
                .expiresAt(LocalDateTime.now().plusWeeks(1))  // 1주 유효 기간 설정
                .build();

        // 배틀 정보 저장
        battleRepository.save(battle);
        
        // 배틀 신청자에게 알림 전송
        NotificationDto requesterNotification = NotificationDto.builder()
                .userId(battle.getRequesterId())
                .senderId(battle.getResponderId())
                .senderNickname(battle.getResponderName()) // 보낸 사람 닉네임 반환
                .battleId(battle.getId())
                .title("request")
                .message(battle.getResponderName() + " 님에게 배틀 요청이 전송되었습니다.<br>유효기간은 1주일이며 만료 시간은 "
                        + battle.getExpiresAt().format(formatter) + "입니다.")
                .timestamp(LocalDateTime.now())
                .build();
        notificationService.sendNotification(battle.getRequesterId(), requesterNotification);

        // 배틀 수신자에게 알림 전송
        NotificationDto notification = NotificationDto.builder()
                .userId(battle.getResponderId())
                .senderId(battle.getRequesterId())
                .senderNickname(battle.getRequesterName()) // 보낸 사람 닉네임 반환
                .battleId(battle.getId())
                .title("request")
                .message(battle.getRequesterName() + " 님이 배틀을 요청했습니다.")
                .timestamp(LocalDateTime.now())
                .build();
        notificationService.sendNotification(battle.getResponderId(), notification);

        // Quartz Job 스케줄링
        scheduleBattleCompletion(battle);

        // 저장된 배틀 정보를 기반으로 BattleDto 생성 및 반환
        log.info("배틀 ID {}가 생성되었습니다.", battle.getId());
        return battleMapper.toDto(battle);
    }

    /**
     * Quartz Scheduler를 이용하여 배틀 종료 작업을 스케줄링
     * @param battle Battle 객체
     */
    private void scheduleBattleCompletion(Battle battle) {
        try {
            // JobDetail 생성 및 battleId 전달
            JobDetail jobDetail = JobBuilder.newJob(BattleCompletionJob.class)
                    .withIdentity("battleCompletionJob-" + battle.getId(), "battleCompletionGroup")
                    .usingJobData("battleId", battle.getId())
                    .build();

            // Trigger 생성: 배틀 만료 시간에 실행
            Trigger trigger = TriggerBuilder.newTrigger()
                    .withIdentity("battleCompletionTrigger-" + battle.getId(), "battleCompletionGroup")
                    .startAt(java.util.Date.from(battle.getExpiresAt().atZone(java.time.ZoneId.systemDefault()).toInstant()))
                    .withSchedule(SimpleScheduleBuilder.simpleSchedule())
                    .build();

            // Job 스케줄링
            scheduler.scheduleJob(jobDetail, trigger);

            // 로그 출력
            log.info("배틀 ID {}에 대해 완료 작업이 스케줄링되었습니다. 만료 시간: {}", battle.getId(), battle.getExpiresAt());

        } catch (SchedulerException e) {
            log.error("배틀 ID {}의 완료 작업 스케줄링 중 오류 발생: {}", battle.getId(), e.getMessage(), e);
        }
    }

    /**
     * 배틀 응답 처리 메서드 (수락 또는 거절)
     * @param responseDto BattleResponseRequestDto
     * @param battleId 배틀 ID
     * @return BattleResponseDto
     */
    @Override
    @Transactional
    public BattleResponseDto handleBattleResponse(BattleResponseRequestDto responseDto, Long battleId) {
        // 배틀을 찾아서 상태 처리
        Battle battle = battleRepository.findById(battleId)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 배틀 ID입니다: " + battleId));
        log.info("배틀 상태 조회 완료: status={}", battle.getStatus());

        // 배틀 상태가 PENDING인지 확인
        validateBattleStatus(battle);
        log.info("배틀 상태 유효성 통과: PENDING 상태");

        // 수신자만 응답할 수 있도록 검증
        validateResponder(battle, responseDto.getUserId());
        log.info("수신자 유효성 통과: userId={}", responseDto.getUserId());

        // 상태에 따른 처리
        if (responseDto.getStatus() == BattleStatus.ACTIVE) {
            handleActiveBattleResponse(battle, responseDto);
        } else if (responseDto.getStatus() == BattleStatus.CANCELED) {
            handleCanceledBattleResponse(battle, responseDto);
        } else {
            throw new IllegalArgumentException("잘못된 배틀 상태입니다.");
        }

        // 배틀 정보 저장
        battleRepository.save(battle);
        log.info("배틀 정보 저장 완료: battleId={}", battleId);

        // 배틀 응답 반환
        return createBattleResponseDto(battle);
    }

    private void validateBattleStatus(Battle battle) {
        if (battle.getStatus() != BattleStatus.PENDING) {
            throw new IllegalStateException("현재 상태에서는 배틀에 응답할 수 없습니다.");
        }
    }

    private void validateResponder(Battle battle, Long userId) {
        if (!battle.getResponderId().equals(userId)) {
            throw new SecurityException("해당 배틀에 응답할 권한이 없습니다.");
        }
    }

    private void handleActiveBattleResponse(Battle battle, BattleResponseRequestDto responseDto) {
        battle.setStatus(BattleStatus.ACTIVE);
        battle.setResponderImageUrl(responseDto.getResponderImage());
        battle.setActiveAt(LocalDateTime.now());
        battle.setExpiresAt(LocalDateTime.now().plusDays(3));

        // 배틀 수락 알림 및 배틀 시작 알림
        sendNotification(battle.getRequesterId(), battle.getResponderId(), battle.getResponderName(), "alarm",
                battle.getResponderName() + " 님과의 배틀이 수락되었습니다.", battle.getId());
        sendNotification(battle.getResponderId(), battle.getRequesterId(), battle.getRequesterName(), "alarm",
                battle.getRequesterName() + " 님과의 배틀이 시작되었습니다!", battle.getId());

        rescheduleBattleCompletion(battle);

        log.info("배틀 ID {}가 ACTIVE 상태로 변경되었습니다. 만료 시간: {}", battle.getId(), battle.getExpiresAt());
    }

    private void handleCanceledBattleResponse(Battle battle, BattleResponseRequestDto responseDto) {
        battle.setStatus(BattleStatus.CANCELED);

        // 배틀 거절 알림
        sendNotification(battle.getRequesterId(), battle.getResponderId(), battle.getResponderName(), "alarm",
                battle.getResponderName() + " 님이 배틀을 거절했습니다.", battle.getId());
        sendNotification(battle.getResponderId(), battle.getRequesterId(), battle.getRequesterName(), "alarm",
                battle.getRequesterName() + " 님과의 배틀이 거절되었습니다.", battle.getId());

        log.info("배틀 ID {}가 CANCELED 상태로 변경되었습니다.", battle.getId());
    }

    private void sendNotification(Long recipientId, Long senderId, String senderNickname, String title, String message, Long battleId) {
        NotificationDto notification = NotificationDto.builder()
                .userId(recipientId)
                .senderId(senderId)
                .senderNickname(senderNickname)
                .title(title)
                .message(message)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .battleId(battleId)
                .build();
        notificationService.sendNotification(recipientId, notification);
    }

    private BattleResponseDto createBattleResponseDto(Battle battle) {
        return BattleResponseDto.builder()
                .battleId(battle.getId())
                .responderId(battle.getResponderId())
                .responderImage(battle.getResponderImageUrl())
                .responderName(battle.getResponderName())
                .status(battle.getStatus())
                .createdAt(battle.getCreatedAt())
                .expiresAt(battle.getExpiresAt())
                .activeAt(battle.getActiveAt())
                .build();
    }


    /**
     * Quartz Scheduler를 이용하여 배틀 만료 작업을 재스케줄링
     * @param battle Battle 객체
     */
    private void rescheduleBattleCompletion(Battle battle) {
        try {
            // 기존 Job 삭제
            JobKey jobKey = JobKey.jobKey("battleCompletionJob-" + battle.getId(), "battleCompletionGroup");
            if (scheduler.checkExists(jobKey)) {
                scheduler.deleteJob(jobKey);
                log.info("배틀 ID {}의 기존 완료 작업이 삭제되었습니다.", battle.getId());
            }

            // 새로운 JobDetail 생성
            JobDetail jobDetail = JobBuilder.newJob(BattleCompletionJob.class)
                    .withIdentity("battleCompletionJob-" + battle.getId(), "battleCompletionGroup")
                    .usingJobData("battleId", battle.getId())
                    .build();

            // 새로운 Trigger 생성: 배틀 만료 시간에 실행
            Trigger trigger = TriggerBuilder.newTrigger()
                    .withIdentity("battleCompletionTrigger-" + battle.getId(), "battleCompletionGroup")
                    .startAt(java.util.Date.from(battle.getExpiresAt().atZone(java.time.ZoneId.systemDefault()).toInstant()))
                    .withSchedule(SimpleScheduleBuilder.simpleSchedule())
                    .build();

            // Job 스케줄링
            scheduler.scheduleJob(jobDetail, trigger);

            // 로그 출력
            log.info("배틀 ID {}에 대해 완료 작업이 재스케줄링되었습니다. 새로운 만료 시간: {}", battle.getId(), battle.getExpiresAt());

        } catch (SchedulerException e) {
            log.error("배틀 ID {}의 완료 작업 재스케줄링 중 오류 발생: {}", battle.getId(), e.getMessage(), e);
        }
    }

    /**
     * 배틀 상세 조회 메서드
     * @param battleId 배틀 ID
     * @return BattleDetailResponseDto
     */
    @Override
    public BattleDetailResponseDto getBattleById(Long battleId) {
        Battle battle = battleRepository.findById(battleId)
                .orElseThrow(() -> new RuntimeException("배틀을 찾을 수 없습니다: " + battleId));

        // DTO로 변환
        BattleDetailResponseDto responseDto = BattleDetailResponseDto.builder()
                .battleId(battle.getId())
                .requesterId(battle.getRequesterId())
                .responderId(battle.getResponderId())
                .requesterImageUrl(battle.getRequesterImageUrl())
                .responderImageUrl(battle.getResponderImageUrl())
                .status(battle.getStatus().name())
                .createdAt(battle.getCreatedAt())
                .expiresAt(battle.getExpiresAt())
                .activeAt(battle.getActiveAt())
                .build();

        log.info("배틀 ID {}의 상세 정보가 조회되었습니다.", battleId);
        return responseDto;
    }

    /**
     * 배틀 투표 처리 메서드
     * @param battleId 배틀 ID
     * @param voteRequestDto VoteRequestDto
     */
    @Override
    @Transactional
    public void voteBattle(Long battleId, VoteRequestDto voteRequestDto) {
        // 배틀 찾기
        Battle battle = battleRepository.findById(battleId)
                .orElseThrow(() -> new CustomException(ErrorCode.BATTLE_NOT_FOUND));

        // 배틀 상태 및 기간 확인
        if (battle.getStatus() != BattleStatus.ACTIVE || battle.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new CustomException(ErrorCode.BATTLE_NOT_ACTIVE);
        }

        // 중복 투표 방지
        boolean hasVoted = voteRepository.existsByBattleIdAndUserId(battleId, voteRequestDto.getUserId());
        if (hasVoted) {
            throw new CustomException(ErrorCode.DUPLICATE_VOTE);
        }

        // 투표 내역 저장
        Vote vote = Vote.builder()
                .battleId(battleId)
                .userId(voteRequestDto.getUserId())
                .votedFor(voteRequestDto.getVotedForId())
                .build();
        voteRepository.save(vote);

        // 투표수 업데이트
        if (vote.getVotedFor().equals(battle.getRequesterId())) {
            battle.setRequesterVotes(battle.getRequesterVotes() + 1);
        } else if (vote.getVotedFor().equals(battle.getResponderId())) {
            battle.setResponderVotes(battle.getResponderVotes() + 1);
        }
        battleRepository.save(battle);

        log.info("배틀 ID {}에 대한 사용자 ID {}의 투표가 저장되었습니다.", battleId, voteRequestDto.getUserId());
    }

    @Override
    public List<BattleDto> getActiveBattlesByRecent(Long userId) {
        List<Battle> battles = battleRepository.findByStatusOrderByCreatedAtDesc(BattleStatus.ACTIVE);
        List<BattleDto> battleDtos = battles.stream()
                .map(battle -> toDtoWithUserVote(battle, userId))
                .collect(Collectors.toList());

        log.info("사용자 ID {}의 ACTIVE 상태의 최신 배틀 리스트가 조회되었습니다. 총 {}개의 배틀.", userId, battleDtos.size());
        return battleDtos;
    }

    @Override
    public List<BattleDto> getActiveBattlesByVote(Long userId) {
        List<Battle> battles = battleRepository.findByStatusOrderByTotalVotesDesc(BattleStatus.ACTIVE);
        List<BattleDto> battleDtos = battles.stream()
                .map(battle -> toDtoWithUserVote(battle, userId))
                .collect(Collectors.toList());

        log.info("사용자 ID {}의 ACTIVE 상태의 총 투표수가 많은 배틀 리스트가 조회되었습니다. 총 {}개의 배틀.", userId, battleDtos.size());
        return battleDtos;
    }

    @Override
    public List<BattleDto> getCompletedBattlesByCompletionTime(Long userId) {
        List<Battle> battles = battleRepository.findByStatusOrderByExpiresAtDesc(BattleStatus.COMPLETED);
        List<BattleDto> battleDtos = battles.stream()
                .map(battle -> toDtoWithUserVote(battle, userId))
                .collect(Collectors.toList());

        log.info("사용자 ID {}의 COMPLETE 상태의 완료순 배틀 리스트가 조회되었습니다. 총 {}개의 배틀.", userId, battleDtos.size());
        return battleDtos;
    }

    @Override
    public List<BattleDto> getCompletedBattlesByVote(Long userId) {
        List<Battle> battles = battleRepository.findByStatusOrderByTotalVotesDesc(BattleStatus.COMPLETED);
        List<BattleDto> battleDtos = battles.stream()
                .map(battle -> toDtoWithUserVote(battle, userId))
                .collect(Collectors.toList());

        log.info("사용자 ID {}의 COMPLETE 상태의 총 투표수가 많은 배틀 리스트가 조회되었습니다. 총 {}개의 배틀.", userId, battleDtos.size());
        return battleDtos;
    }
    private BattleDto toDtoWithUserVote(Battle battle, Long userId) {
        BattleDto dto = battleMapper.toDto(battle);
        Vote vote = voteRepository.findByBattleIdAndUserId(battle.getId(), userId);
        log.info("vote: {}", vote);
        if (vote != null) {
            dto.setMyPickUserId(vote.getVotedFor());
        }
        return dto;
    }

    /**
     * 특정 사용자의 배틀 리스트 조회 메서드
     * @param userId 사용자 ID
     * @return List<BattleDto>
     */
    @Override
    public List<BattleDto> getUserBattles(Long userId) {
        // 하나의 userId로 신청자 또는 수신자로 검색
        List<Battle> battles = battleRepository.findByRequesterIdOrResponderId(userId);

        // 각 배틀마다 사용자가 투표한 내역 조회 및 설정
        List<BattleDto> battleDtos = battles.stream().map(battle -> {
            BattleDto dto = battleMapper.toDto(battle);
            Vote vote = voteRepository.findByBattleIdAndUserId(battle.getId(), userId);
            if (vote != null) {
                dto.setMyPickUserId(vote.getVotedFor());
            }
            return dto;
        }).collect(Collectors.toList());

        log.info("사용자 ID {}의 배틀 리스트가 조회되었습니다. 총 {}개의 배틀.", userId, battleDtos.size());
        return battleDtos;
    }


}
