package com.threeheads.battle.service;

import reactor.core.publisher.Flux;

public interface NotificationService {

    // 특정 사용자에게 전송할 SSE 이벤트 스트림 생성
    Flux<String> getNotificationsForUser(Long userId);

    // 새로운 알림을 전송하는 메서드 (배틀 수신 또는 배틀 종료 등 이벤트)
    void sendNotification(Long userId, String message);
}