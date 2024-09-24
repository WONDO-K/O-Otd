package com.threeheads.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "`likes`")
public class Like {

    @Id
    private int clothesId;

    @Id
    private int userId;

    private LocalDateTime likeDate;


}