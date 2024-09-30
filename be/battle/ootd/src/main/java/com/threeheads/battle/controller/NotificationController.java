package com.threeheads.battle.controller;

import com.threeheads.battle.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping(value = "/notifications/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> getUserNotifications(@PathVariable Long userId) {
        return notificationService.getNotificationsForUser(userId);
    }
}
