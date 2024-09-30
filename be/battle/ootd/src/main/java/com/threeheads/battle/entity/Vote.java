package com.threeheads.battle.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "votes")
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long battleId;
    private Long voterId;
    private Long votedFor; // 누구에게 투표했는지 (requester 또는 responder)

}
