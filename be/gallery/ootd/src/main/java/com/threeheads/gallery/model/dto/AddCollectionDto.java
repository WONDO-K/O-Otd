package com.threeheads.gallery.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddCollectionDto {
    private int userId;
    private long clothesId;
}
