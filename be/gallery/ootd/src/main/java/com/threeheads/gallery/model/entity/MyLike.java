package com.threeheads.gallery.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="MyLike")
public class MyLike {
    @Id
    private long clothesId;

    @Column(name="user_id",nullable = false)
    private int userId;

    @Column(name = "like_date",nullable = false)
    private LocalDateTime likeDateTime;

}
