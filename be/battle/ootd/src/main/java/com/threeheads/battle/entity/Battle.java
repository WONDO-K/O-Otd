package com.threeheads.battle.entity;

import com.threeheads.battle.common.enums.BattleStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "battles")
public class Battle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long requesterId; // 배틀 신청자 ID

    @Column(nullable = true)
    private Long responderId; // 배틀 수락자 ID (수락 전에는 null일 수 있음)

    @Column(nullable = false)
    private String requesterName; // 신청자의 이름

    @Column(nullable = true)
    private String responderName; // 수락자의 이름 (수락 전에는 null일 수 있음)

    @Column(nullable = false)
    private String requesterImageUrl; // 신청자의 이미지 URL

    @Column(nullable = true)
    private String responderImageUrl; // 수락자의 이미지 URL (수락 전에는 null일 수 있음)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BattleStatus status; // 배틀 상태 (ACTIVE, COMPLETED, EXPIRED 등)

    @Column(nullable = false)
    private LocalDateTime createdAt; // 배틀 생성 시간

    @Column(nullable = false)
    private LocalDateTime expiresAt; // 배틀 만료 시간 (24시간 이후 자동 삭제)

    // 배틀이 ACTIVE 상태로 변경된 시간 (수락된 시간)
    @Column(nullable = true)
    private LocalDateTime activeAt; // ACTIVE 상태로 변경된 시간

    // 추가: 투표수 (디폴트 값 0)
    @Column(nullable = false)
    @Builder.Default // 빌더 패턴을 사용할 때 기본값을 0으로 설정
    private int requesterVotes = 0; // 신청자에게 투표한 수

    @Column(nullable = false)
    @Builder.Default // 빌더 패턴을 사용할 때 기본값을 0으로 설정
    private int responderVotes = 0; // 수락자에게 투표한 수

    // 추가: 배틀 결과 (선택사항)
    @Column(nullable = true)
    private Long winnerId; // 배틀 승리자의 ID (배틀이 끝난 후에 설정)

}
