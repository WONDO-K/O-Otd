package com.threeheads.battle.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 알림을 저장하는 엔티티 클래스
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 알림의 고유 ID

    @Column(nullable = false)
    private Long userId; // 알림을 받을 사용자 ID

    @Column(nullable = false)
    private Long battleId; // 알림과 연관된 배틀 ID

    @Column(nullable = false)
    private String title; // 알림 제목

    @Column(nullable = false)
    private String message; // 알림 메시지

    @Column(nullable = false)
    private LocalDateTime timestamp; // 알림 발생 시간

    @Column(nullable = false)
    private boolean isRead; // 알림 읽음 여부
}
