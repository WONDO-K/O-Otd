package com.threeheads.gallery.model.service;

import com.threeheads.gallery.model.entity.Gallery;
import com.threeheads.gallery.model.entity.MyLike;
import com.threeheads.gallery.model.dto.AddCollectionDto;
import com.threeheads.gallery.model.dto.CollectionDto;
import com.threeheads.gallery.model.dto.GalleryDetailDto;
import com.threeheads.gallery.model.repository.GalleryRepository;
import com.threeheads.gallery.model.repository.LikeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class GalleryServiceImpl implements GalleryService {

    private final LikeRepository likeRepository;
    private final GalleryRepository galleryRepository;

    public GalleryServiceImpl(LikeRepository likeRepository, GalleryRepository galleryRepository){
        this.likeRepository = likeRepository;
        this.galleryRepository = galleryRepository;

    }

    @Override
    public MyLike addCollection(AddCollectionDto dto) {
        int userId = dto.getUserId();
        long clothesId = dto.getClothesId();

        MyLike myLikeEntity = new MyLike();

        myLikeEntity.setClothesId(clothesId);
        myLikeEntity.setUserId(userId);
        myLikeEntity.setLikeDateTime(LocalDateTime.now());
        try {
            return likeRepository.save(myLikeEntity);  // 데이터베이스에 저장
        } catch (DataAccessException e) {
            // 에러 발생 시 예외 처리
            System.err.println("addCollection / Error saving Like: " + e.getMessage());
           return null;
        }
    }

    @Override
    public List<CollectionDto> getCollectionList(Long userId) {
        List<MyLike> myLikes;
        List<CollectionDto> result;
        try {
            myLikes = likeRepository.findAllByUserId(userId);
            result=myLikes.stream().map(myLike -> new CollectionDto(
                    myLike.getClothesId(),
                    myLike.getUserId(),
                    myLike.getLikeDateTime()

            )).toList();
            for(CollectionDto dto:result)
                log.info("CollectionDto: {}", dto); // 로그 출력
            return result;
        }
        catch(Exception e){
            System.err.println("get Collection List err");
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public GalleryDetailDto getGalleryDetail(int galleryId) {
        GalleryDetailDto galleryDetailDto = new GalleryDetailDto();
        Gallery gallery = galleryRepository.findGalleryDetailByGalleyId(galleryId);
        galleryDetailDto.setImageUrl(gallery.getPhotoUrl());
        galleryDetailDto.setImageId(gallery.getGalleryId());
        galleryDetailDto.setLikesCount(gallery.getLikesCount());
        galleryDetailDto.setUploadedAt(gallery.getUploadedAt());
        // TODO: 분류에서 가져오기
        // galleryDetailDto.getCategory("");

        return galleryDetailDto;
    }
}
