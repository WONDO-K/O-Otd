package com.threeheads.gallery.model.service;

import com.threeheads.gallery.model.dto.GalleryListResponseDto;
import com.threeheads.gallery.model.entity.Gallery;
import com.threeheads.gallery.model.entity.MyLike;
import com.threeheads.gallery.model.dto.AddCollectionDto;
import com.threeheads.gallery.model.dto.CollectionDto;
import com.threeheads.gallery.model.dto.GalleryDetailDto;
import com.threeheads.gallery.model.repository.GalleryRepository;
import com.threeheads.gallery.model.repository.LikeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.transaction.annotation.Transactional;
import javax.swing.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j

public class GalleryServiceImpl implements GalleryService {

    private final LikeRepository likeRepository;
    private final GalleryRepository galleryRepository;
    private final RestTemplate restTemplate;

    @Value("${spring.classificationFashion.service.url}")
    private String classificationFashionUrl;

    public GalleryServiceImpl(LikeRepository likeRepository, GalleryRepository galleryRepository, RestTemplateBuilder restTemplateBuilder){
        this.likeRepository = likeRepository;
        this.galleryRepository = galleryRepository;
        this.restTemplate = restTemplateBuilder.build();

    }


    // 마이 컬렉션 추가
    
    @Override
    @Transactional
    public MyLike addCollection(AddCollectionDto dto) {
        int userId = dto.getUserId();
        long clothesId = dto.getClothesId();

        MyLike myLikeEntity = new MyLike();

        myLikeEntity.setClothesId(clothesId);
        myLikeEntity.setUserId(userId);
        myLikeEntity.setLikeDateTime(LocalDateTime.now());
        try {
            galleryRepository.upLike(clothesId);
            return likeRepository.save(myLikeEntity);  // 데이터베이스에 저장
        } catch (DataAccessException e) {
            // 에러 발생 시 예외 처리
            System.err.println("addCollection / Error saving Like: " + e.getMessage());
           return null;
        }
    }

    //마이컬렉션 리스트 조회
    @Override
    public List<CollectionDto> getCollectionList(Long userId) {
        List<MyLike> myLikes;
        List<CollectionDto> result;
        try {
            myLikes = likeRepository.findAllByUserId(userId);
            result=myLikes.stream().map(myLike -> new CollectionDto(
                    myLike.getClothesId(),
                    myLike.getUserId(),
                    myLike.getLikeDateTime(),
                    0,
                    null

            )).toList();
            
            for(CollectionDto c:result){
                c.setLikesCount(galleryRepository.searchLikesCount(c.getClothesId()));
                String name = "img_"+c.getClothesId()+".%";
                c.setImageUrl(galleryRepository.findUrlByImageName(name));
            }
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
        Gallery gallery = galleryRepository.findGalleryDetailByGalleryId(galleryId);
        galleryDetailDto.setCategory(gallery.getType());
        galleryDetailDto.setImageUrl(gallery.getPhotoUrl());
        galleryDetailDto.setImageId(gallery.getGalleryId());
        galleryDetailDto.setLikesCount(gallery.getLikesCount());
        galleryDetailDto.setUploadedAt(gallery.getUploadedAt());
        log.info("galleryDetailDto: {}",  galleryDetailDto); // 로그 출력
        return galleryDetailDto;
    }

    @Override
    public List<GalleryListResponseDto> getGalleryList(String type) {
        List<Gallery> gallerylist;
        List<GalleryListResponseDto> result;
        if(!type.equals(""))
            gallerylist = galleryRepository.findGalleryListByType(type);
        else
            gallerylist = galleryRepository.findGalleryRandomList();


        result=gallerylist.stream().map(clothes -> new GalleryListResponseDto(
            clothes.getGalleryId(),
            clothes.getPhotoUrl(),
            clothes.getType(),
            clothes.getUploadedAt())).toList();

        for(GalleryListResponseDto data:result)
            log.info("galleryDetailDto: {}",  data);
        return result;
    }

    @Override
    public boolean delMyCollection(long clothesId) {
        try{
            likeRepository.deleteById(clothesId);
            return true;
        }
        catch (EmptyResultDataAccessException e){
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<Gallery> searchLook(String type) {
        List<Gallery> result;
        result=galleryRepository.findGalleryListByType(type);
        return result;
    }

    @Override
    public List<Gallery> getWeekPick() {
        List<Gallery> result;
        result = galleryRepository.findWeekPick();
        return result;
    }

    @Override
    public Object getAiResult(List<String> image_urls) {
        Map<String, List<String>> params = new HashMap<>();
        params.put("image_urls", image_urls);

        // 2개일 때
        if(image_urls.size()==2){
            Map<String,Object>response = restTemplate.postForObject(classificationFashionUrl, params, Map.class);
            if (response.get("response")==null) {
                return (String) response.get("err");
            }
            else{
                List<Integer> result = (List<Integer>) response.get("response");
                List<String> twoResult = new ArrayList<>();
                for(int num:result){
                    String name = "img_"+num+".%";
                    twoResult.add(galleryRepository.findUrlByImageName(name));
                }
                for(String data:twoResult)
                    log.info("input two result data: {}", data);
                return twoResult;
            }
        }
        else{ // 1개일 때
            Map<String,Object>response = restTemplate.postForObject(classificationFashionUrl, params, Map.class);

            if (response.get("response")==null) {
                return (String) response.get("err");
            }
            else{
                List<Integer> result = (List<Integer>) response.get("response");
                List<String> oneResult = new ArrayList<>();
                for(int num:result){
                    String name = "img_"+num+".%";
                    oneResult.add(galleryRepository.findUrlByImageName(name));
                }
                for(String data:oneResult)
                    log.info("input ont result data: {}", data);
                response.put("response",oneResult);
                return response;
            }
        }

    }

    
}
