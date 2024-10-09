package com.threeheads.battle.controller;

import com.threeheads.battle.dto.NotificationDto;
import com.threeheads.battle.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;

/**
 * 실시간 알림 관련 API 엔드포인트를 관리하는 컨트롤러
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * 특정 사용자에게 실시간 알림을 제공하는 엔드포인트
     * @param userId 사용자 ID
     * @return Flux<NotificationDto>
     */
    @GetMapping(value = "/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<NotificationDto> getUserNotifications(@PathVariable Long userId) {
        return notificationService.getNotificationsForUser(userId);
    }

    /**
     * 특정 사용자의 알림 목록(히스토리)을 조회하는 엔드포인트
     * @param userId 사용자 ID
     * @return 알림 리스트
     */
    @GetMapping("/list/{userId}")
    public List<NotificationDto> getNotificationHistory(@PathVariable Long userId) {
        return notificationService.getNotificationHistory(userId);
    }

    /**
     * 읽지 않은 알림의 개수를 조회하는 엔드포인트
     * @param userId 사용자 ID
     * @return 알림 개수
     */
    @GetMapping("/unread-count/{userId}")
    public long getUnreadNotificationsCount(@PathVariable Long userId) {
        return notificationService.countUnreadNotifications(userId);
    }

    /**
     * 특정 알림을 읽음 처리하는 엔드포인트
     * @param notificationId 알림 ID
     * @return 성공 메시지
     */
    @PostMapping("/read/{notificationId}")
    public ResponseEntity<String> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok("알림이 읽음 상태로 변경되었습니다.");
    }

    @PostMapping("/read-all/{userId}")
    public ResponseEntity<String> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok("특정 사용자의 읽지 않은 알림을 모두 읽음 처리합니다.");
    }
}
