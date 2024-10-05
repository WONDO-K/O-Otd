package com.threeheads.gallery.model.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GalleryDetailDto {
        private int imageId;

        private String imageUrl;

        private String category;

        private LocalDateTime uploadedAt;

        private String likesCount;
}
