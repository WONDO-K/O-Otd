package com.threeheads.battle.service.impl;

import com.threeheads.battle.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    // 사용자별로 알림을 저장하기 위한 ConcurrentHashMap
    private final Map<Long, Sinks.Many<String>> userNotifications = new ConcurrentHashMap<>();

    @Override
    public Flux<String> getNotificationsForUser(Long userId) {
        // 사용자별 알림 저장소가 없다면 생성
        userNotifications.putIfAbsent(userId, Sinks.many().replay().limit(1));
        // 사용자의 알림을 스트림으로 반환
        return userNotifications.get(userId).asFlux().delayElements(Duration.ofMillis(500));
    }

    @Override
    public void sendNotification(Long userId, String message) {
        // 해당 사용자에게 새로운 알림을 전송
        userNotifications.computeIfPresent(userId, (id, sink) -> {
            sink.tryEmitNext(message);
            return sink;
        });
    }

}
