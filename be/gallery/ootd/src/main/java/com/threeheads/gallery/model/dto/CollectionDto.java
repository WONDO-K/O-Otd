package com.threeheads.gallery.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CollectionDto {
    private long clothesId;
    private int userId;
    private LocalDateTime likeDateTime;
}
