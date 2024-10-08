package com.threeheads.gallery.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GalleryListResponseDto {

    private int imageId;

    private String imageUrl;

    private String category;

    private LocalDateTime uploadedAt;
}
