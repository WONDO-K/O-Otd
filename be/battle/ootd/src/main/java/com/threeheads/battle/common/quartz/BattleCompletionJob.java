package com.threeheads.battle.common.quartz;

import com.threeheads.battle.common.enums.BattleStatus;
import com.threeheads.battle.dto.NotificationDto;
import com.threeheads.battle.entity.Battle;
import com.threeheads.battle.repository.BattleRepository;
import com.threeheads.battle.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 배틀 완료 작업 클래스
 * 배틀이 만료되거나 완료될 때 상태를 변경하고 알림을 전송
 */
@Component
@RequiredArgsConstructor
public class BattleCompletionJob implements Job {

    private static final Logger logger = LoggerFactory.getLogger(BattleCompletionJob.class);

    private final BattleRepository battleRepository;
    private final NotificationService notificationService;

    /**
     * Quartz가 작업을 실행할 때 호출되는 메서드
     * @param context JobExecutionContext
     * @throws JobExecutionException
     */
    @Override
    @Transactional
    public void execute(JobExecutionContext context) throws JobExecutionException {
        // JobDataMap에서 battleId 추출
        Long battleId = context.getJobDetail().getJobDataMap().getLong("battleId");

        try {
            // 배틀 조회
            Battle battle = battleRepository.findById(battleId)
                    .orElseThrow(() -> new JobExecutionException("배틀을 찾을 수 없습니다: " + battleId));

            // 현재 시간 가져오기
            LocalDateTime now = LocalDateTime.now();

            // 배틀 상태에 따라 처리
            switch (battle.getStatus()) {
                case PENDING:
                    // PENDING 상태가 만료된 경우 EXPIRED로 변경
                    if (battle.getExpiresAt().isBefore(now)) {
                        battle.setStatus(BattleStatus.EXPIRED);
                        battleRepository.save(battle);
                        // 알림 전송
                        sendNotificationToUsers(battle.getRequesterId(), battle.getRequesterName(), battle.getResponderId(), battle.getResponderName(),
                                "배틀 요청이 만료되었습니다.", "배틀 요청 만료");
                        logger.info("배틀 ID {}의 상태가 EXPIRED로 변경되었습니다.", battleId);
                    }
                    break;

                case ACTIVE:
                    // ACTIVE 상태가 만료된 경우 COMPLETED로 변경
                    if (battle.getExpiresAt().isBefore(now)) {
                        battle.setStatus(BattleStatus.COMPLETED);
                        // TODO: 배틀의 승자를 결정하고 유저 userBattle(배틀 횟수), userWin(승리 횟수) 업데이트 필요함 -> 유저 테이블 업데이트
                        battleRepository.save(battle);
                        // 알림 전송
                        sendNotificationToUsers(battle.getRequesterId(), battle.getRequesterName(), battle.getResponderId(), battle.getResponderName(),
                                "배틀이 종료되었습니다.", "배틀 종료");
                        logger.info("배틀 ID {}의 상태가 COMPLETED로 변경되었습니다.", battleId);
                    }
                    break;

                default:
                    // 다른 상태에서는 아무 작업도 수행하지 않음
                    logger.info("배틀 ID {}는 상태가 PENDING이나 ACTIVE가 아닙니다. 현재 상태: {}", battleId, battle.getStatus());
                    break;
            }

        } catch (Exception e) {
            logger.error("배틀 ID {}의 완료 작업 중 오류 발생: {}", battleId, e.getMessage(), e);
            throw new JobExecutionException(e);
        }
    }


    /**
     * 사용자들에게 알림을 전송하는 메서드
     * @param requesterId 요청자 ID
     * @param responderId 응답자 ID
     * @param message 알림 메시지
     * @param title 알림 제목
     */
    private void sendNotificationToUsers(Long requesterId,String requesterName, Long responderId, String responderName, String message, String title) {
        NotificationDto notificationRequester = NotificationDto.builder()
                .userId(requesterId)
                .senderId(responderId)
                .senderNickname(responderName)
                .title(title)
                .message(message)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();

        NotificationDto notificationResponder = NotificationDto.builder()
                .userId(responderId)
                .senderId(requesterId)
                .senderNickname(requesterName)
                .title(title)
                .message(message)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();

        notificationService.sendNotification(requesterId, notificationRequester);
        notificationService.sendNotification(responderId, notificationResponder);
    }
}
