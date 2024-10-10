package com.threeheads.battle.service.impl;

import com.threeheads.battle.dto.NotificationDto;
import com.threeheads.battle.entity.Notification;
import com.threeheads.battle.repository.NotificationRepository;
import com.threeheads.battle.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 실시간 알림 서비스 구현 클래스
 */
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);

    // 사용자별로 알림을 저장하기 위한 ConcurrentHashMap
    private final Map<Long, Sinks.Many<NotificationDto>> userNotifications = new ConcurrentHashMap<>();

    private final NotificationRepository notificationRepository;

    /**
     * 사용자에게 실시간 알림을 제공하는 Flux 반환 메서드
     * @param userId 사용자 ID
     * @return Flux<NotificationDto>
     */
    @Override
    public Flux<NotificationDto> getNotificationsForUser(Long userId) {
        // 사용자별 알림 저장소가 없다면 생성
        userNotifications.putIfAbsent(userId, Sinks.many().multicast().onBackpressureBuffer());
        // 사용자의 알림을 스트림으로 반환
        logger.info("사용자 ID {}의 알림 스트림이 요청되었습니다.", userId);
        return userNotifications.get(userId).asFlux().delayElements(Duration.ofMillis(500));
    }

    /**
     * 특정 사용자에게 알림을 전송하는 메서드
     * @param userId 사용자 ID
     * @param notificationDto 전송할 알림 DTO
     */
    @Override
    public void sendNotification(Long userId, NotificationDto notificationDto) {
        // 알림을 데이터베이스에 저장
        Notification notification = Notification.builder()
                .id(notificationDto.getId())
                .userId(userId)
                .battleId(notificationDto.getBattleId())
                .senderId(notificationDto.getSenderId())
                .senderNickname(notificationDto.getSenderNickname())
                .title(notificationDto.getTitle())
                .message(notificationDto.getMessage())
                .timestamp(notificationDto.getTimestamp())
                .isRead(false) // 새로운 알림은 읽지 않은 상태로 설정
                .build();
        notificationRepository.save(notification);
        logger.info("데이터베이스에 알림이 저장되었습니다: {}", notification);

        // 해당 사용자에게 새로운 알림을 전송
        userNotifications.computeIfPresent(userId, (id, sink) -> {
            sink.tryEmitNext(notificationDto);
            return sink;
        });
        logger.info("사용자 ID {}에게 알림이 전송되었습니다: {}", userId, notificationDto);
    }

    /**
     * 특정 사용자의 알림 목록을 조회하는 메서드
     * @param userId 사용자 ID
     * @return 알림 리스트
     */
    @Override
    public List<NotificationDto> getNotificationHistory(Long userId) {
        List<Notification> notifications = notificationRepository.findAllByUserIdOrderByTimestampDesc(userId);
        List<NotificationDto> notificationDtos = notifications.stream()
                .map(notification -> NotificationDto.builder()
                        .id(notification.getId())
                        .userId(notification.getUserId())
                        .senderId(notification.getSenderId())
                        .senderNickname(notification.getSenderNickname())
                        .battleId(notification.getBattleId())
                        .title(notification.getTitle())
                        .message(notification.getMessage())
                        .timestamp(notification.getTimestamp())
                        .isRead(notification.isRead())
                        .build())
                .collect(Collectors.toList());
        logger.info("사용자 ID {}의 알림 히스토리가 조회되었습니다. 총 {}개의 알림.", userId, notificationDtos.size());
        return notificationDtos;
    }

    /**
     * 특정 사용자의 읽지 않은 알림 수를 조회하는 메서드
     * @param userId 사용자 ID
     * @return 읽지 않은 알림 수
     */
    @Override
    public long countUnreadNotifications(Long userId) {
        long count = notificationRepository.countByUserIdAndIsReadFalse(userId);
        logger.info("사용자 ID {}의 읽지 않은 알림 수: {}", userId, count);
        return count;
    }

    /**
     * 특정 알림을 읽음 처리하는 메서드
     * @param notificationId 알림 ID
     */
    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("알림을 찾을 수 없습니다: " + notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
        logger.info("알림 ID {}가 읽음 상태로 변경되었습니다.", notificationId);
    }

    @Override
    public void markAllAsRead(Long userId) {
        // 사용자 ID로 해당 사용자의 모든 읽지 않은 알림을 조회
        List<Notification> notifications = notificationRepository.findAllByUserIdAndIsReadFalse(userId);

        // 각 알림을 읽음 상태로 변경
        notifications.forEach(notification -> notification.setRead(true));

        // 변경된 알림들을 저장
        notificationRepository.saveAll(notifications);

        logger.info("사용자 ID {}의 모든 알림이 읽음 상태로 변경되었습니다.", userId);
    }
}
