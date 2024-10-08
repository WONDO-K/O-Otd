package com.threeheads.gallery.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@Table(name="MyFashion")
@AllArgsConstructor
@NoArgsConstructor
public class MyFashion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wardrobe_id", nullable = false)
    private int wardrobeId;

    @Column(name="create_date")
    private LocalDate createDate;

    @Column(name="wardrobe_battle",nullable=false)
    private int wardrobeBattle=0;

    @Column(name = "wardrobe_win",nullable=false)
    private int wardrobeWin = 0;

    @Column(name="is_delete",nullable=false)
    private boolean isDelete =false;

    @Column(name="user_id",nullable=false)
    private int userId;

    @Column(name="category_code",nullable=false)
    private int categoryCode;
}
