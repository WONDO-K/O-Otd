package com.threeheads.battle.common;

import com.threeheads.battle.common.enums.BattleStatus;
import com.threeheads.battle.entity.Battle;
import com.threeheads.battle.repository.BattleRepository;
import com.threeheads.battle.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BattleScheduler {

    private final BattleRepository battleRepository;
    private final NotificationService notificationService;

    // 매일 자정에 삭제 작업 실행 (0시 0분 0초)
    @Scheduled(cron = "0 0 0 * * ?")  // 매일 자정 실행
    //@Scheduled(cron = "0 0 0/3 * * ?")  // 매 3시간마다 실행
    public void removeExpiredOrCanceledBattles() {
        LocalDateTime now = LocalDateTime.now();

        // CANCELED 또는 EXPIRED 상태인 배틀을 모두 가져옴
        List<Battle> battlesToDelete = battleRepository.findAllByStatusInAndExpiresAtBefore(
                List.of(BattleStatus.CANCELED, BattleStatus.EXPIRED), now);

        // 배틀 삭제
        if (!battlesToDelete.isEmpty()) {
            battleRepository.deleteAll(battlesToDelete);
            System.out.println("삭제된 배틀 개수: " + battlesToDelete.size());
        }
    }

    // 3시간마다 실행 (1주일을 넘긴 ACTIVE 상태 배틀을 COMPLETED로 변경)
    //@Scheduled(fixedRate = 10800000)  // 3시간마다 실행
    @Scheduled(fixedRate = 3600000)  // 1시간마다 실행
    public void completeExpiredActiveBattles() {
        LocalDateTime now = LocalDateTime.now();

        // ACTIVE 상태의 배틀 중에서 유효기간이 지난 배틀을 조회
        List<Battle> expiredBattles = battleRepository.findAllByStatusAndExpiresAtBefore(BattleStatus.ACTIVE, now);

        for (Battle battle : expiredBattles) {
            battle.setStatus(BattleStatus.COMPLETED);  // 상태를 COMPLETED로 변경
            battleRepository.save(battle);  // 상태 저장

            // 배틀 종료 알림
            notificationService.sendNotification(battle.getRequesterId(), "배틀이 종료되었습니다.");
            notificationService.sendNotification(battle.getResponderId(), "배틀이 종료되었습니다.");
        }

    }
}
