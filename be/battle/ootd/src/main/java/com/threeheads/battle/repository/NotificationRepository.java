package com.threeheads.battle.repository;

import com.threeheads.battle.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Notification 엔티티를 위한 Repository 인터페이스
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    /**
     * 특정 사용자에 대한 모든 알림을 시간순으로 조회
     * @param userId 사용자 ID
     * @return 알림 리스트
     */
    List<Notification> findAllByUserIdOrderByTimestampDesc(Long userId);

    /**
     * 특정 사용자의 읽지 않은 알림 수를 조회
     * @param userId 사용자 ID
     * @return 읽지 않은 알림 수
     */
    long countByUserIdAndReadFalse(Long userId);
}
