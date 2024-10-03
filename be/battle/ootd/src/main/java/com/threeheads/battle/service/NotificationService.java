package com.threeheads.battle.service;

import com.threeheads.battle.dto.NotificationDto;
import reactor.core.publisher.Flux;

import java.util.List;

/**
 * 실시간 알림을 제공하는 서비스 인터페이스
 */
public interface NotificationService {
    /**
     * 특정 사용자에게 실시간 알림을 제공하는 Flux 반환 메서드
     * @param userId 사용자 ID
     * @return Flux<NotificationDto>
     */
    Flux<NotificationDto> getNotificationsForUser(Long userId);

    /**
     * 특정 사용자에게 알림을 전송하는 메서드
     * @param userId 사용자 ID
     * @param notificationDto 전송할 알림 DTO
     */
    void sendNotification(Long userId, NotificationDto notificationDto);

    /**
     * 특정 사용자의 알림 목록을 조회하는 메서드
     * @param userId 사용자 ID
     * @return 알림 리스트
     */
    List<NotificationDto> getNotificationHistory(Long userId);

    /**
     * 특정 사용자의 읽지 않은 알림 수를 조회하는 메서드
     * @param userId 사용자 ID
     * @return 읽지 않은 알림 수
     */
    long countUnreadNotifications(Long userId);

    /**
     * 특정 알림을 읽음 처리하는 메서드
     * @param notificationId 알림 ID
     */
    void markAsRead(Long notificationId);
}
