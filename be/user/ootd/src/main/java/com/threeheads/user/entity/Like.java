package com.threeheads.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "likes")
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id")
    private Long userId;  // user와 물리적으로 연결된 필드

    @Column(name = "clothes_id")
    private Long clothesId;  // 논리적으로만 연결된 필드 (Hadoop에 존재)

    @Column(name = "like_date", nullable = false)
    private LocalDateTime likeDate;
}

