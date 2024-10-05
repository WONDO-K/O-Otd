package com.threeheads.gallery.model.service;

import com.threeheads.gallery.model.entity.MyLike;
import com.threeheads.gallery.model.dto.AddCollectionDto;
import com.threeheads.gallery.model.dto.CollectionDto;
import com.threeheads.gallery.model.dto.GalleryDetailDto;

import java.util.List;

public interface GalleryService {

    public MyLike addCollection(AddCollectionDto dto);
    public List<CollectionDto> getCollectionList(Long userId);
    public GalleryDetailDto getGalleryDetail(int galleryId);
}
