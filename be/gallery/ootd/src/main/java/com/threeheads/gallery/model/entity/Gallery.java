package com.threeheads.gallery.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="Gallery")
@AllArgsConstructor
@NoArgsConstructor
public class Gallery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int galleryId;

    @Column(name="photo_name",nullable = false)
    private String photoName;

    @Column(name="photo_url",nullable = false)
    private String photoUrl;

    @Column(name="likes_count",nullable = false)
    int likesCount;

    @Column(name="uploaded_at",nullable = false)
    LocalDateTime uploadedAt;

    @Column(name="type",nullable = false)
    String type;

    @Column(name="is_delete",nullable=false)
    boolean isDelete = false;
}
